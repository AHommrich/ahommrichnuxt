# Wähle das Node.js-Image
FROM node:18-alpine

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Baue das Nuxt-Projekt
RUN npm run build

# Setze die Umgebungsvariablen für Nitro
ENV NITRO_PRESET=node-server

# Exponiere den Port
EXPOSE 3000

# Starte den Nuxt-Server
CMD ["node", ".output/server/index.mjs"]
