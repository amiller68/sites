# Geney Next.js App

This is the Next.js version of the Geney marketing site with blog functionality.

## Current Configuration

⚠️ **Static Export Mode**: The app is currently configured for static export to deploy on Render as a static site. This means:
- ISR (Incremental Static Regeneration) is disabled
- Blog content won't auto-update (requires rebuild/redeploy)
- No API routes
- Image optimization is disabled
- No pagination or filtering on blog page (shows up to 50 posts)

## Deployment on Render

### Deploy as Static Site

1. **Create a new Static Site** on Render
2. **Connect your repository**
3. **Configure build settings:**
   - **Root Directory**: `ts/apps/next`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

### Environment Variables

Add these to your Render service:
- `QUOTIENT_PRIVATE_API_KEY` - Your Quotient API key (if different from default)
- `BASE_URL` - Your production URL (e.g., https://yourdomain.com)

## To Re-enable ISR (Server Mode)

If you want to deploy as a web service with ISR functionality:

1. Edit `next.config.js`:
   ```js
   // Remove or comment out these lines:
   output: 'export',
   unoptimized: true,
   ```

2. Deploy as a **Web Service** on Render:
   - **Root Directory**: `ts/apps/next`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

With server mode, you'll get:
- ISR working (blog updates every 60 seconds, posts every hour)
- API routes support
- Optimized images
- Dynamic content updates without rebuilds

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server (server mode only)
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (creates `out` folder in static mode)
- `npm run start` - Start production server (server mode only)
- `npm run lint` - Run linting
- `npm run fmt` - Format code
- `npm run fmt:check` - Check code formatting

## Blog Content

Blog content is fetched from Quotient CMS. In static mode, content is fetched at build time only.