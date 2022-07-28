FROM node:lts-alpine AS dependencies
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:lts-alpine AS builder
WORKDIR /opt/app
# The base url will vary with environment, so better move it to build SECRET when we need more environments
ENV NEXT_PUBLIC_BASE_URL https://web-data-marketplace-prod.radix.equinor.com/
ENV NEXT_PUBLIC_COLLIBRA_BASE_URL https://equinor-dev.collibra.com/rest/2.0
ENV NEXT_PUBLIC_AUTH_AUTHORITY https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0
ENV NEXT_PUBLIC_AUTH_CLIENT_ID 41912e0a-18ba-46d8-98a3-634a38b8fffb
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
