FROM node:16-buster as builder

ARG WORKING_DIR="/app"

WORKDIR ${WORKING_DIR}

COPY ./packages/server/ ${WORKING_DIR}/server

COPY ./packages/config/.env ${WORKING_DIR}/server/.env

COPY ./packages/common/ ${WORKING_DIR}/common/

WORKDIR ${WORKING_DIR}/server

RUN npm i

RUN npm run build

FROM node:16-buster

ARG WORKING_DIR="/usr/local/cudos-private-sale-kyc" 

RUN if [ $USER_NAME != 'root' ]; then \
        groupmod -g 2000 node; \
        usermod -u 2000 -g 2000 node; \
        groupadd --gid ${GROUP_ID} ${GROUP_NAME}; \
        useradd --no-log-init --create-home --shell /bin/bash --uid ${USER_ID} --gid ${GROUP_ID} ${USER_NAME}; \
    fi

WORKDIR ${WORKING_DIR}
COPY --from=builder "/app/server" ./

RUN chown -R node:node ${WORKING_DIR}

USER node

WORKDIR ${WORKING_DIR}

RUN npm i --omit=dev

CMD ["npm", "run", "start:prod"] 
