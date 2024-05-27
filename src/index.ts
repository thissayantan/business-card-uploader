import { R2Bucket } from '@cloudflare/workers-types';

interface Env {
	MY_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.split('/')[1]; // Assumes path is like /image-12345

		if (request.method === 'POST') {
			const formData = await request.formData();
			const file = formData.get('file'); // Changed 'image' to 'file'

			if (file instanceof File) {
				const objectName = `image-${Date.now()}`;

				try {
					await env.MY_BUCKET.put(objectName, file.stream(), {
						httpMetadata: {
							contentType: file.type,
						},
					});

					const publicUrl = `${url.origin}/${objectName}`;
					return new Response(JSON.stringify({ url: publicUrl }), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				} catch (error) {
					return new Response(JSON.stringify({ error: `Failed to upload: ${error}` }), {
						status: 500,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				}
			} else {
				return new Response(JSON.stringify({ error: 'No file uploaded or wrong input type' }), {
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}
		} else if (request.method === 'GET' && path) {
			try {
				const object = await env.MY_BUCKET.get(path);
				if (!object) {
					return new Response('File not found', { status: 404 });
				}
				return new Response(object.body, {
					status: 200,
					headers: {
						'Content-Type': object.httpMetadata.contentType,
					},
				});
			} catch (error) {
				return new Response(`Error retrieving file: ${error}`, { status: 500 });
			}
		}

		return new Response('Send a POST request with an image or a valid image file path', {
			status: 400,
		});
	},
};
