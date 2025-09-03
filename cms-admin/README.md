# Stoopside Scribbles CMS Admin

Content Management System for stoopsidescribbles.com

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in Vercel:
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-cms.vercel.app)
   - `NEXTAUTH_SECRET`: Generate a secure secret key

## Development

```bash
npm run dev
```

## Production Deployment

This project is configured for Vercel deployment. Connect your GitHub repository to Vercel for automatic deployments.

## Default Credentials (Change in Production!)

- Username: admin
- Password: password

## Environment Variables

Create a `.env.local` file for local development:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

For production, set these in Vercel dashboard.