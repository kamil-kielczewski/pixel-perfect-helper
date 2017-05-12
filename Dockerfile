# Builds a Docker to deliver dist/

FROM smebberson/alpine-nginx-nodejs
ARG JSENV_FILE_URL
RUN apk update && apk add bash \
 && apk add openssl

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app \
 && cp -a /tmp/node_modules /opt/app/

# download .env.js file if link is given (but empty file will be deleted)
RUN cd /tmp \
 && curl -o .env.js $JSENV_FILE_URL > /dev/null 2>&1 | : \
 && if [ ! -s /tmp/.env.js ] ; then rm -f /tmp/.env.js; fi

WORKDIR /opt/app
ADD . /opt/app
RUN if [ ! -f .env.js ]; then cp .env.example.js .env.js; fi \
 && if [ -f /tmp/.env.js ]; then cp /tmp/.env.js .env.js; fi

RUN npm run build:aot && cp -af ./dist/. /usr/html

