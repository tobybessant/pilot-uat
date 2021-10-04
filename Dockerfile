FROM node:16 AS client

WORKDIR /app/client
COPY client/ ./
RUN npm ci
RUN npm run build

# Build server
FROM node:16 AS server

WORKDIR /app/server
COPY server/ ./
RUN mkdir -p ./src/assets
RUN npm ci
RUN npm run build

# Compile release files
FROM node:16 AS release
WORKDIR /
COPY --from=server /app/server/node_modules ./node_modules
COPY --from=server /app/server/dist ./dist
COPY --from=client /app/client/dist ./dist/public

EXPOSE 8080

ARG DB_HOST=db
ARG DB_USER=sa
ARG DB_PASSWORD=Test@12345
ARG DB_DATABASE=pilot-db

ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}

CMD [ "node", "dist/app.js" ]