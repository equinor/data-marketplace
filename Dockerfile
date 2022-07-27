FROM node:lts-alpine AS dependencies
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:lts-alpine AS builder
WORKDIR /opt/app
ARG ARG_COLLIBRA_BASE_URL
ARG ARG_AUTH_AUTHORITY
ARG ARG_AUTH_CLIENT_ID

RUN DECODED_ARG_COLLIBRA_BASE_URL=$(echo $ARG_COLLIBRA_BASE_URL|base64 -d)
RUN DECODED_ARG_AUTH_AUTHORITY=$(echo $ARG_AUTH_AUTHORITY|base64 -d)
RUN DECODED_ARG_AUTH_CLIENT_ID=$(echo $ARG_AUTH_CLIENT_ID|base64 -d)

ENV NEXT_PUBLIC_COLLIBRA_BASE_URL ${DECODED_ARG_COLLIBRA_BASE_URL}
RUN echo ${NEXT_PUBLIC_COLLIBRA_BASE_URL}
ENV NEXT_PUBLIC_AUTH_AUTHORITY ${DECODE_ARG_AUTH_AUTHORITY}
ENV NEXT_PUBLIC_AUTH_CLIENT_ID ${DECODE_ARG_AUTH_CLIENT_ID}
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
