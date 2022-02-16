# Stage 1
FROM node:12.14.0 as build-step
EXPOSE 4200

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app

RUN npm run build --prod

# Stage 2
FROM nginx:stable-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/dist/art-kubika /usr/share/nginx/html