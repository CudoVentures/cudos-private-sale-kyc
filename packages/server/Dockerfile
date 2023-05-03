FROM node:16-buster as builder

ARG WORKING_DIR="/usr/src/cudos-private-sale-kyc"

WORKDIR ${WORKING_DIR}

COPY ./packages/server/ ${WORKING_DIR}/src/

COPY ./packages/config/.env ${WORKING_DIR}/src/.env

COPY ./packages/common/ ${WORKING_DIR}/common/

WORKDIR ${WORKING_DIR}/src

RUN npm i

RUN npm run build

FROM node:16-buster

ARG WORKING_DIR="/usr/local/app" 

WORKDIR ${WORKING_DIR}

COPY --from=builder "/usr/src/cudos-private-sale-kyc/" ./

WORKDIR ${WORKING_DIR}/src

RUN npm i --omit=dev

CMD ["npm", "run", "start:prod"] 

# ENTRYPOINT ["tail", "-f", "/dev/null"]