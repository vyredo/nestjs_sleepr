
    FROM node:alpine As development
    
    WORKDIR /usr/src/app
    COPY pnpm-lock.yaml ./
    COPY tsconfig.json tsconfig.json
    COPY nest-cli.json nest-cli.json
    
    COPY apps/payments apps/payments
    COPY libs libs
    
    RUN npm install -g pnpm
    RUN pnpm install -r
    
    RUN cd apps/payments && pnpm run build payments
    
    # Production image
    FROM node:alpine As production
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /usr/src/app
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    
    RUN npm install -g pnpm
    RUN pnpm install --prod
    
    COPY --from=development /usr/src/app/dist ./dist
    CMD ["node", "dist/apps/payments/main"]
    