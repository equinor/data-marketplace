FROM node:lts-alpine AS dependencies
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:lts-alpine AS builder
WORKDIR /opt/app
COPY . .
COPY --from=dependencies /opt/app/node_modules ./node_modules
RUN npm run build


FROM node:lts-alpine AS runner
WORKDIR /opt/app
ENV NODE_ENV production
ENV PORT 3000
ENV USER nextjs
ENV UID 12345
ENV GID 23456

RUN addgroup -S "$USER" && \
  adduser -S \
  --disabled-password \
  --gecos "" \
  --home "/opt/app" \
  --ingroup "$USER" \
  --no-create-home \
  --uid "$UID" \
  "$USER"

COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/package.json ./package.json

RUN chown -R "$USER":"$USER" .
USER "$UID"

COPY --from=builder /opt/app/node_modules ./node_modules

EXPOSE "$PORT"
CMD ["npm", "start"]
