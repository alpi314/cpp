# Dockerfile
FROM node:18
WORKDIR /app
COPY /app .
RUN npm install
CMD ["node", "main.js"]
