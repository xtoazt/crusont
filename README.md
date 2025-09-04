# Crusont - AI-Powered Development Platform

An AI-powered development platform inspired by v0.app, featuring Code generation, intelligent Chat, and Super-powered responses using multiple AI models. Built with Next.js, TypeScript, and powered by Zukijourney API.

## Features

### Core Features
- **Code**: Generate, edit, and collaborate on code with AI assistance
- **Chat**: Have intelligent conversations with advanced AI models
- **Super**: Get the best answers using multiple AI models combined

### Developer Features (Developer Account Required)
- **Text-to-Speech**: Convert text to natural-sounding speech
- **Image Upscaling**: Enhance image quality using AI
- **Text Translation**: Translate text between multiple languages
- **Content Moderation**: Analyze and moderate text content
- **Embeddings**: Generate vector embeddings for text

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon PostgreSQL (Serverless)
- **AI Integration**: Zukijourney API
- **Authentication**: Custom JWT-based auth system
- **UI Components**: Lucide React icons, React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database
- Zukijourney API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crusont
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Database
DATABASE_URL="your-neon-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Zukijourney API
ZUKIJOURNEY_DEFAULT_API_KEY="your-default-api-key"
ZUKIJOURNEY_API_URL="https://api.zukijourney.com"

# JWT
JWT_SECRET="your-jwt-secret"
```

5. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: User accounts with different types (USER, DEVELOPER)
- **Session**: User authentication sessions
- **ApiKey**: Developer API keys for Zukijourney
- **ChatMessage**: Chat conversation history
- **CodeProject**: Saved code projects
- **SuperQuery**: Super AI query history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Core Features
- `POST /api/chat` - Send chat message
- `POST /api/code` - Generate code
- `GET /api/code` - Get code projects
- `POST /api/super` - Super AI query
- `GET /api/super` - Get super queries

### Developer Features
- `POST /api/developer/tts` - Text-to-speech
- `POST /api/developer/embeddings` - Generate embeddings
- `POST /api/developer/moderate` - Content moderation
- `POST /api/developer/upscale` - Image upscaling
- `POST /api/developer/translate` - Text translation

## Account Types

### User Account
- Access to Code, Chat, and Super features
- Uses shared API keys when available
- Basic functionality

### Developer Account
- All User account features
- Access to advanced developer features
- Requires Zukijourney API key
- API key is shared with other users when not in use

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |
| `ZUKIJOURNEY_DEFAULT_API_KEY` | Default Zukijourney API key | Yes |
| `ZUKIJOURNEY_API_URL` | Zukijourney API base URL | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Inspired by [v0.app](https://v0.app)
- Powered by [Zukijourney](https://zukijourney.com)
- Built with [Next.js](https://nextjs.org)
- Database hosted on [Neon](https://neon.tech)