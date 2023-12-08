const fs = require('fs')

const cwd = process.cwd()
const dirs = fs.readdirSync(cwd + '/../apps')

dirs.forEach(dir => {
    const path = `${cwd}/../apps/${dir}`;
    const stats = fs.statSync(path);
    // ignore file
    if (stats.isFile()) {
        return;
    }

    try {
        // delete dockerfile
        fs.unlinkSync(`${path}/Dockerfile`)
    } catch (error) {
        console.log(error)
    }
    
    const template = createTemplate({
        module: dir
    })

    fs.writeFileSync(`${path}/Dockerfile`, template)
})

/** 
 * interface CreateTemplateParams {
 *      module: string;
 *      
 * }
 */
function createTemplate ({
    module
})  {
    return  `
    FROM node:alpine As development
    
    WORKDIR /usr/src/app
    COPY pnpm-lock.yaml ./
    COPY tsconfig.json tsconfig.json
    COPY nest-cli.json nest-cli.json
    
    COPY apps/${module} apps/${module}
    COPY libs libs
    
    RUN npm install -g pnpm
    RUN pnpm install -r
    
    RUN cd apps/${module} && pnpm run build ${module}
    
    # Production image
    FROM node:alpine As production
    ARG NODE_ENV=production
    ENV NODE_ENV=\${NODE_ENV}
    
    WORKDIR /usr/src/app
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    
    RUN npm install -g pnpm
    RUN pnpm install --prod
    
    COPY --from=development /usr/src/app/dist ./dist
    CMD ["node", "dist/apps/${module}/main"]
    `
}