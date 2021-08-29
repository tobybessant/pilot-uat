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
CMD [ "node", "dist/app.js" ]