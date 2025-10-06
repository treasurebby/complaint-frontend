# Customer Complaint Portal (Frontend)

This is a small React + Vite + TailwindCSS frontend intended to be hosted as a static site (e.g., Amazon S3 + CloudFront) and to send complaints to an Amazon API Gateway endpoint.

Quick start

1. Copy `.env.example` to `.env` and set `VITE_API_ENDPOINT` to your API Gateway POST URL.
2. Install dependencies:

   npm install

3. Run locally:

   npm run dev

4. Build for production:

   npm run build

5. Deploy `dist/` to S3 (or other static hosting). Ensure CORS is enabled on your API Gateway endpoint to allow the site origin.

Notes

- The endpoint is read from the environment variable `VITE_API_ENDPOINT` at build time. Example: `https://.../prod/complaints`.
- The UI shows loading, success, and error states, and validates required fields in the browser.
