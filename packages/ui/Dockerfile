FROM node:16-buster as builder

ARG WORKING_DIR="/usr/src/cudos-private-sale-ui"

WORKDIR ${WORKING_DIR}

COPY ./packages/ui/ ${WORKING_DIR}/src/

COPY ./packages/config/.env ${WORKING_DIR}/config/.env

COPY ./packages/common/ ${WORKING_DIR}/common/

WORKDIR ${WORKING_DIR}/src

RUN npm i

RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

FROM node:16-buster

ARG WORKING_DIR="/usr/local/cudos-private-sale-ui" 

RUN if [ $USER_NAME != 'root' ]; then \
        groupmod -g 2000 node; \
        usermod -u 2000 -g 2000 node; \
        groupadd --gid ${GROUP_ID} ${GROUP_NAME}; \
        useradd --no-log-init --create-home --shell /bin/bash --uid ${USER_ID} --gid ${GROUP_ID} ${USER_NAME}; \
    fi

WORKDIR ${WORKING_DIR}

COPY --from=builder "/usr/src/cudos-private-sale-ui" ./

WORKDIR ${WORKING_DIR}/src

RUN npm i --omit=dev

CMD ["npm", "run", "start"] 
