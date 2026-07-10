# Match the Node version declared in .nvmrc so local and container builds agree.
FROM node:20-alpine

# Chromium and required system libraries for Puppeteer headless PDF generation.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy manifests first to keep the dependency layer cacheable between code-only changes.
COPY package*.json ./

# `npm ci` fails fast on a lockfile drift and installs exactly what's pinned — reproducible builds.
RUN npm ci

COPY . .

RUN npm run build

# Nitro preset for a standalone Node server (matches the deploy target).
ENV NITRO_PRESET=node-server

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
