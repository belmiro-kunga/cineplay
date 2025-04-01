FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Usar --legacy-peer-deps para evitar problemas de compatibilidade e ignorar registry errors
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --legacy-peer-deps --no-fund

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main"] 