FROM node:20.8.0-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install -g npm@10.2.0
RUN npm ci


FROM node:20.8.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1 

RUN yarn build


FROM node:20.8.0-alpine as production
WORKDIR /app

# ENV NEXT_TELEMETRY_DISABLED 1
# ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 7700

ENV PORT 7700

CMD ["npm", "run", "start"]
