# Match the Node version declared in .nvmrc so local and container builds agree.
# Nuxt 4 + the @nuxt/eslint toolchain require Node 22+ (Object.groupBy, engines).
FROM node:22-alpine

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
# .npmrc carries legacy-peer-deps=true — required because the dependency graph trips
# npm's ERESOLVE/edgesOut resolver bug otherwise.
COPY package*.json .npmrc ./

# npm bug #4828: with a package-lock present, npm skips the optional native
# bindings (oxc-parser/rolldown) and `nuxt build` fails with "Cannot find native
# binding". Dropping the lock forces a fresh resolve that installs the matching
# platform binding. The bindings are pinned in package.json optionalDependencies,
# so the native layer stays deterministic despite the fresh resolve.
RUN rm -f package-lock.json && npm install --no-audit --no-fund

COPY . .

RUN npm run build

# Nitro preset for a standalone Node server (matches the deploy target).
ENV NITRO_PRESET=node-server

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
