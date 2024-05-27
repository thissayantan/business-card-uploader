# Cloudflare Image Uploader Worker

This project contains a Cloudflare Worker that allows for image uploads directly to a Cloudflare R2 bucket. It's written in TypeScript, making use of Cloudflare's Workers environment to handle image storage efficiently and securely.

## Features

- **Image Upload**: Supports uploading images via POST request.
- **R2 Integration**: Seamlessly stores images in a designated Cloudflare R2 bucket.
- **Error Handling**: Provides robust error handling and response codes for different scenarios.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or Yarn

Additionally, you must have a Cloudflare account with access to R2 storage and Workers.

## Getting Started

### 1. Clone the Repository

Start by cloning this repository to your local machine:

```bash
git clone git@github.com:thissayantan/business-card-uploader.git
cd business-card-uploader
```

### 2. Install Dependencies

Install the necessary Node.js dependencies:

```bash
npm install
```

### 3. Configuration

Configure your project by editing the `wrangler.toml` file to include your Cloudflare account details and R2 bucket information:

```toml
name = "my-image-uploader"
workers_dev = true

[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "your-bucket-name"
```

### 4. Develop Locally

You can use Wrangler to run your worker locally for development:

```bash
wrangler dev
```

### 5. Deploy

Deploy your worker to Cloudflare using Wrangler:

```bash
wrangler deploy
```

## Usage

To upload an image to your Worker, send a POST request with the image as form data:

```bash
curl -F "image=@path_to_your_image.jpg" https://business-card.your_account.workers.dev
```

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cloudflare Workers documentation
- Cloudflare Community
