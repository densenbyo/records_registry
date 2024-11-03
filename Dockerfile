FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
FROM node:16 AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
