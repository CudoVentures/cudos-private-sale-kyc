FROM node:16-buster as builder

ARG WORKING_DIR="/usr/src/cudos-private-sale-ui"

COPY ./ ${WORKING_DIR}

WORKDIR ${WORKING_DIR}

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

# COPY --from=builder "/usr/src/cudos-allowlist/package.json" ./package.json


COPY --from=builder "/usr/src/cudos-private-sale-ui/.env" ./.env

# RUN chown -R node:node ${WORKING_DIR}

# USER node

RUN npm i --omit=dev

CMD ["npm", "run", "start"] 