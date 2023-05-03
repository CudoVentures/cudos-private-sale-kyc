FROM node:16-buster as builder

ARG WORKING_DIR="/usr/src/cudos-private-sale-kyc"

WORKDIR ${WORKING_DIR}

COPY ./packages/server/ ./server

COPY ./packages/common/ ./common/

WORKDIR ${WORKING_DIR}/server

RUN npm i

RUN npm run build

FROM node:16-buster

ARG WORKING_DIR="/usr/local/app" 

WORKDIR ${WORKING_DIR}

COPY --from=builder "/usr/src/cudos-private-sale-kyc/server/build" ./build

COPY --from=builder "/usr/src/cudos-private-sale-kyc/server/build/common" ./common

COPY ./packages/config/.env ./build/config/.env
COPY ./packages/server/package.json ./package.json
COPY ./packages/server/key.json ./key.json

RUN npm i --omit=dev

CMD ["npm", "run", "start:prod"] 
