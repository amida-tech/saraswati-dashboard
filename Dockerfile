# FROM  node:16.14.2-alpine3.15

# WORKDIR /app

# COPY ./package.json .
# COPY ./yarn.lock .
# ADD . /app
# RUN yarn install --frozen-lockfile && yarn cache clean
# EXPOSE 3000
# CMD [ "yarn", "start" ]

# Builder image
FROM node:18.18.2-alpine3.18 as builder

WORKDIR /app

# Copy only necessary files to install dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --frozen-lockfile && yarn cache clean
# Up til this point should get cached and only re-run if dependencies change

# Update browser list
RUN npx browserslist@latest --update-db

# Copy necessary files to build
COPY . /app
COPY ./public/index.html /app/public

RUN yarn build

# Production Installer image
FROM nginx:1.27-bookworm

WORKDIR /app

# Copy only necessary files to install prod deps
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]