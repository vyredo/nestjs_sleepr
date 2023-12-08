
    FROM node:alpine As development
    
    WORKDIR /usr/src/app
    COPY pnpm-lock.yaml ./
    COPY tsconfig.json tsconfig.json
    COPY nest-cli.json nest-cli.json
    
    COPY apps/notifications apps/notifications
    COPY libs libs
    
    RUN npm install -g pnpm
    RUN pnpm install -r
    
    RUN cd apps/notifications && pnpm run build notifications
    
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
    CMD ["node", "dist/apps/notifications/main"]
    