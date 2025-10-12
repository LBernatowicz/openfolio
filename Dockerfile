# Bardzo prosty Dockerfile dla OpenFolio
FROM node:18

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki package
COPY package.json ./

# Zainstaluj wszystkie zależności z maksymalną tolerancją błędów
RUN npm install --legacy-peer-deps --force --no-audit --no-fund --no-optional

# Skopiuj kod źródłowy
COPY . .

# Wyłącz telemetrię Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Zbuduj aplikację
RUN npm run build

# Ustaw zmienne środowiskowe dla produkcji
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Eksponuj port
EXPOSE 3000

# Uruchom aplikację
CMD ["npm", "start"]