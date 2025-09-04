# Crusont Deployment Guide

## Vercel Deployment

### Prerequisites
1. Vercel account
2. GitHub repository with your code
3. Neon database (or any PostgreSQL database)

### Environment Variables
Set these in your Vercel project settings:

```
DATABASE_URL=postgresql://neondb_owner:npg_v9pbTljRwWQ5@ep-wispy-term-ad6d1e6o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
ZUKIJOURNEY_DEFAULT_API_KEY=zu-754e7f37b406faaadcf3fcee54061b27
ZUKIJOURNEY_API_URL=https://api.zukijourney.com
JWT_SECRET=your-jwt-secret-here
```

### Build Configuration
The project is configured with:
- `vercel.json` for proper Prisma handling
- `postinstall` script to generate Prisma client
- Build script includes `prisma generate`

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - the build process will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js application

### Database Setup
1. Run `npx prisma db push` to create tables
2. Or use Prisma Studio: `npx prisma studio`

## Features Included
- ✅ User authentication (JWT-based)
- ✅ Code generation with Monaco Editor
- ✅ AI chat with voice input
- ✅ Super queries with multiple models
- ✅ Developer features:
  - Text-to-Speech
  - Image upscaling
  - Text translation
  - Content moderation
  - Text embeddings

## Troubleshooting
- If Prisma errors occur, ensure `DATABASE_URL` is set correctly
- Check that all environment variables are configured
- Verify database connection and permissions
