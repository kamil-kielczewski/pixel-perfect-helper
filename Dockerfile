# Usage (given build times depend on machine):
#
#    Build SMALL image (no cache; ~20MB, time for build=rebuild = ~360s):
#    docker build --squash="true" -t pixel-perfect:small .
#
#    Build FAST (rebuild) image (cache; >280MB, build time ~360s, rebuild time ~80s):
#    docker build -t pixel-perfect:fast .
#
#    Clean (remove intermidiet images):
#    docker rmi -f $(docker images -f "dangling=true" -q)
#
#    Run image (on localhost:8080):
#    docker run --name pixel-perfect -p 8080:80 pixel-perfect:small &
#
#    Run image as virtual host (read more: https://github.com/jwilder/nginx-proxy):
#    docker run -e VIRTUAL_HOST=angular-starter.your-domain.com --name pixel-perfect pixel-perfect:small &

FROM nginx:1.13.0-alpine

# install console and node
# RUN apk add --no-cache bash=4.3.46-r5 &&\
#     apk add --no-cache openssl=1.0.2k-r0 &&\ # this line cause error - openssl lib not found on net
#     apk add --no-cache nodejs
RUN apk update && \
    apk add bash=4.3.46-r5 && \
    apk add nodejs=6.9.5-r0

# install npm ( in separate dir due to docker cache)
ADD package.json /tmp/npm_inst/package.json
RUN cd /tmp/npm_inst &&\
    npm install &&\
    mkdir -p /tmp/app &&\
    mv /tmp/npm_inst/node_modules /tmp/app/

# build and publish application
ADD . /tmp/app
RUN cd /tmp/app &&\
    npm run build:aot &&\
    mv ./dist/* /usr/share/nginx/html/

# clean
RUN rm -Rf /tmp/npm_inst  &&\
    rm -Rf /tmp/app &&\
    rm -Rf /root/.npm &&\
    apk del nodejs

# this is for virtual host purposes
EXPOSE 80
