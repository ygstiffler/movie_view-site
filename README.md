# Movie View - Frontend

A modern React-based movie review application frontend built with Vite.

## Features

- 🎬 Browse and search movies
- ⭐ Rate and review movies
- ❤️ Save favorite movies
- 🔐 User authentication (Google OAuth & Email/Password)
- 📱 Responsive design
- 🎨 Beautiful UI with animations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **Google OAuth** - Authentication

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   NODE_ENV=development
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for development (outputs to ../back_end/public)
- `npm run build:prod` - Build for production (outputs to dist/)
- `npm run build:dev` - Build for development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run clean` - Clean build artifacts

## Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build:prod
   ```

2. **Deploy the `dist` folder** to your hosting service

### Environment Variables for Production

Create `.env` file in production with:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
NODE_ENV=production
```

### Deployment Options

#### Static Hosting (Vercel, Netlify, etc.)
1. Run `npm run build:prod`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

#### Server Deployment
1. Run `npm run build:prod`
2. Serve the `dist` folder with a web server (nginx, Apache, etc.)
3. Configure API proxy if needed

#### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Configuration

### API Base URL
The app uses `VITE_API_BASE_URL` environment variable. Make sure this points to your backend API in production.

### Google OAuth
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your domain to authorized JavaScript origins
5. Set `VITE_GOOGLE_CLIENT_ID` in your environment

## Build Optimization

The production build includes:
- Code splitting for better performance
- Minification with Terser
- Bundle optimization
- Asset optimization

## Troubleshooting

### Common Issues

1. **Build fails**: Check all environment variables are set
2. **API calls fail**: Verify `VITE_API_BASE_URL` is correct
3. **Google OAuth not working**: Check client ID and authorized domains

### Local Development

If API calls fail during development, ensure:
- Backend server is running on port 5000
- CORS is properly configured on backend
- Environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Backend Deployment (Railway)

The Node/Express API that powers authentication lives in `back_end/` and is wired for Railway out of the box.

- **Environment variables** – copy `back_end/env.example` to `.env`, then fill in `MONGO_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and `FRONTEND_URL`.  These same keys must be added to your Railway service under **Variables** (Railway will inject `PORT` and `RAILWAY_PUBLIC_DOMAIN` automatically).
- **Docker-based deploy** – the root-level `Dockerfile` and `.dockerignore` scope the build to `back_end`. Railway will autodetect this Dockerfile; no extra configuration is needed even though this is a monorepo.
- **Database** – provision a MongoDB plugin in Railway (or supply an external URI) and set `MONGO_URL` to the connection string. The server will refuse to boot if this value is missing, so misconfigurations surface early.
- **Start command** – the container runs `npm ci --omit=dev` and then `node server.js` via the `start` script defined in `back_end/package.json`.
- **Health check** – Railway can use `GET /api/health` to verify readiness; it returns `status: OK` when the service and database are reachable.
- **Allowed origins** – set `FRONTEND_URL` to your deployed frontend domain. The backend also whitelists `https://${RAILWAY_PUBLIC_DOMAIN}` automatically so the default Railway URL works without extra tweaks.

For manual deployments with the Railway CLI:

```bash
railway login
railway init --service movie-review-api
railway variables set MONGO_URL="your-mongo-uri" JWT_SECRET="super-secret" GOOGLE_CLIENT_ID="google-oauth-client" FRONTEND_URL="https://your-frontend"
railway up
```

Each push to the connected Git repository will trigger a rebuild using this configuration, ensuring the backend stays production-ready.