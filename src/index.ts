/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Import the types needed for Cloudflare Workers and R2 bindings
import { R2Bucket } from '@cloudflare/workers-types';

// Define the environment variables as interface
interface Env {
	MY_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Ensure that only POST requests are handled
		if (request.method === 'POST') {
			const formData = await request.formData();
			const file = formData.get('image');

			// Check if the file is received and is of type 'File'
			if (file instanceof File) {
				const objectName = `image-${Date.now()}`;

				try {
					// Upload the file to the R2 bucket
					await env.MY_BUCKET.put(objectName, file.stream(), {
						httpMetadata: {
							contentType: file.type,
						},
					});

					return new Response(`File uploaded as ${objectName}`, { status: 200 });
				} catch (error) {
					return new Response(`Failed to upload: ${error}`, { status: 500 });
				}
			} else {
				return new Response('No file uploaded or wrong input type', { status: 400 });
			}
		}

		// Default response for non-POST requests
		return new Response('Send a POST request with an image', { status: 400 });
	},
};
