#Build Stage: alternative node:latest
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Production stage: alternative nginx:latest
FROM nginx:1.29.4-alpine3.23 as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx","-g", "daemon off;"]
