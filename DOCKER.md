# Docker Setup

## Prerequisites

This Next.js application uses:
- **Node 24 Alpine** base image
- **Standalone output** for optimized container size
- **Multi-stage build** for smaller production images
- **Non-root user** for security

## Building the Docker Image

```bash
docker build -t eddata-www .
```

### Run the Container

```bash
docker run -d -p 3000:3000 \
  -e EDDATA_DOMAIN=your-domain.com \
  -e EDDATA_API_BASE_URL=https://api.your-domain.com \
  -e EDDATA_AUTH_BASE_URL=https://auth.your-domain.com \
  eddata-www
```

## Docker Compose Example

Create a `.env` file (see `.env.docker.example`):
```bash
cp .env.docker.example .env
# Edit .env with your configuration
```

Start with docker-compose:
```bash
docker-compose up -d
```

Or use the provided `docker-compose.yml`:
```yaml
version: '3.8'

services:
  eddata-www:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - EDDATA_DOMAIN=your-domain.com
      - EDDATA_API_BASE_URL=https://api.your-domain.com
      - EDDATA_AUTH_BASE_URL=https://auth.your-domain.com
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'node', '-e', "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Environment Variables

- `EDDATA_DOMAIN` - Your domain name
- `EDDATA_API_BASE_URL` - API base URL
- `EDDATA_AUTH_BASE_URL` - Authentication service URL

## GitHub Container Registry

The image is automatically built and pushed to GitHub Container Registry on:
- Push to `main` branch
- Push to `node24` branch
- New version tags (`v*`)

Pull the latest image:
```bash
docker pull ghcr.io/eddataapi/eddata-www:latest
```

## Multi-platform Support

The Docker image is built for both `linux/amd64` and `linux/arm64` architectures.
