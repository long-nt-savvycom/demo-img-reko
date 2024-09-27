
###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# RUN npm config set registry http://registry.npmjs.org/
# RUN npm config set fetch-timeout 60000
RUN npm install -g npm@10.4.0
RUN npm ci

COPY --chown=node:node . .
COPY --chown=node:node .env.prod .env

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .
COPY --chown=node:node .env.prod .env

# RUN npm config set registry http://registry.npmjs.org/
# RUN npm config set fetch-timeout 60000
RUN npm install -g npm@10.4.0

RUN npm run build

# RUN npx nestia swagger

ENV NODE_ENV production

# RUN npm ci --only=production && npm cache clean --force
RUN npm ci --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env.prod ./.env
COPY --chown=node:node --from=build /usr/src/app/swagger.json ./swagger.json

CMD [ "node", "dist/src/main.js" ]