FROM node:lts-alpine AS dependencies
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:lts-alpine AS builder
WORKDIR /opt/app
ENV COLLIBRA_BASE_URL https://equinor-test.collibra.com/rest/2.0
ENV NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING InstrumentationKey=e4d53b02-e08f-45e0-8632-7a066b44bc4f;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/
ENV NEXT_PUBLIC_COLLIBRA_FIRST_TIME_VISITOR https://equinor-test.collibra.com

COPY . .
COPY --from=dependencies /opt/app/node_modules ./node_modules
COPY ./load-appinsights.js ./
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
COPY --from=builder /opt/app/load-appinsights.js ./

RUN chown -R "$USER":"$USER" .
USER "$UID"

COPY --from=builder /opt/app/node_modules ./node_modules

EXPOSE "$PORT"
CMD ["npm", "start"]
