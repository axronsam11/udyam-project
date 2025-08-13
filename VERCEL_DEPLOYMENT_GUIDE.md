# Vercel Deployment Guide for Udyam Registration Portal

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (for database)
- Cloudinary account (for file uploads)

### 2. Environment Variables Setup

Create these environment variables in your Vercel dashboard:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam-registration

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# App Configuration
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 3. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure build settings
6. Add environment variables in the Vercel dashboard
7. Deploy!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts to configure your project
```

### 4. Post-Deployment Configuration

#### 4.1 Domain Setup
- Your app will be available at `https://your-project-name.vercel.app`
- You can add custom domains in Vercel dashboard

#### 4.2 Environment Variables
Go to your Vercel project dashboard → Settings → Environment Variables and add all the required variables listed above.

#### 4.3 MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get your connection string and add it to `MONGODB_URI`

#### 4.4 Cloudinary Setup
1. Sign up for Cloudinary account
2. Get your cloud name, API key, and API secret from dashboard
3. Add these to your Vercel environment variables

### 5. API Routes Structure

Your API endpoints will be available at:
- `https://your-app.vercel.app/api/` - API root
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/registrations` - Registration endpoints
- `https://your-app.vercel.app/api/documents` - Document upload endpoints

### 6. Troubleshooting

#### Common Issues:

1. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Check build logs in Vercel dashboard

2. **Environment Variables**
   - Make sure all required env vars are set in Vercel dashboard
   - Restart deployment after adding new env vars

3. **Database Connection**
   - Verify MongoDB connection string
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

4. **API Routes Not Working**
   - Check that API files are in `/api` directory
   - Verify function exports are correct
   - Check function logs in Vercel dashboard

### 7. Performance Optimization

- **Static Generation**: Most pages are statically generated for better performance
- **API Caching**: Consider implementing caching for frequently accessed data
- **Image Optimization**: Using Next.js Image component with Cloudinary
- **Bundle Analysis**: Use `@next/bundle-analyzer` to optimize bundle size

### 8. Security Considerations

- All API routes include CORS headers
- Rate limiting implemented (100 requests per 15 minutes)
- Input validation on all endpoints
- Secure file upload restrictions
- Environment variables for sensitive data

### 9. Monitoring and Logs

- View deployment logs in Vercel dashboard
- Function logs available for debugging API issues
- Set up error tracking (Sentry recommended)
- Monitor performance with Vercel Analytics

### 10. Scaling

- Vercel automatically scales serverless functions
- Consider upgrading to Pro plan for higher limits
- Monitor function execution time and memory usage
- Implement database connection pooling for high traffic

## 🎉 Your Udyam Registration Portal is now live on Vercel!

Visit your deployed application and test all functionality:
- Multi-step registration form
- Form validation and auto-save
- Document uploads (if Cloudinary is configured)
- Progress tracking
- Review and submission

## Support

If you encounter any issues during deployment, check:
1. Vercel deployment logs
2. Function logs for API errors
3. Browser console for frontend errors
4. MongoDB Atlas logs for database issues

Happy deploying! 🚀
