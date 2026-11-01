FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
