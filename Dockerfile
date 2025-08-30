FROM node:20-alpine

# Install git (needed for npm install from GitHub repos)
RUN apk add --no-cache git

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev || npm install --omit=dev

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
