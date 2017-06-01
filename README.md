[![Alt AIRAVANA](./src/assets/img/airavana-logo.png?raw=true "Optional Title")](http://airavana.net)




# Pixel Perfect Helper
 
This tool if for measure and compare devloped web page with layout created by graphican. 
 
Here is [ONLINE WORKING PROJECT](http://pixel-perfect.airavana.net/) 
(currently support only for chrome)


### Quick start
**Make sure you have Node version >= 5.0 and NPM >= 3**

Clone/Download the repo and in console execute commands: 

```bash
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/kamil-kielczewski/pixel_perfect_helper.git

# change directory to our repo
cd airavana

# install the repo with npm
npm install

# install typings (important in linux - in macos can be omit)
npm run typings install

# create file .env.js from example and edit it
cp .env.example.js .env.js

# start the server
npm start
```
go to [http://0.0.0.0:3004](http://0.0.0.0:3004) or [http://localhost:3004](http://localhost:3004) in your browser

# Table of Contents
* [Getting Started](#getting-started)
* [Docker](#docker)
* [Server](#server)
* [License](#license)


# Getting Started

This tool based on framework: [angular2 webpack starter](https://github.com/AngularClass/angular2-webpack-starter) 2017-03-08 [commit 55d4325](https://github.com/AngularClass/angular2-webpack-starter/tree/55d4325aad6caae60e9a15749f1d15953a9f51d6).

## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v4.x.x`+ (or `v5.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

# Deployment

## Docker

To run project you only need host machine with **operationg system** with installed **git** (to clone this repo) 
and [docker](https://www.docker.com/) and thats all - any other software is non needed
(other software like node.js etc. will be automatically downloaded and installed inside docker container during build step based on dockerfile).

### Install docker

#### MacOs:

`brew cask install docker`

And run docker by Mac bottom menu> launchpad > docker (on first run docker will ask you about password)

#### Ubuntu:

```
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker  # test:  shoud be ‘active’
```
And add your user to docker group (to avoid `sudo` before using `docker` command in future):
```
sudo usermod -aG docker $(whoami)
```
and lougout and login again.

### Build image

Because *node.js* is big memory consumer you need 1-2GB RAM or virtual memory to build docker image 
(it was successfully tested on machine with 512MB RAM + 2GB virtual memory - building process take 7min)

Go to main project folder. To build big (~280MB) image which has cached data and is able to **FAST** rebuild  
(this is good for testing or staging environment) type: 

`docker build -t pixel-perfect .`

To build **SMALL** (~20MB) image without cache (so each rebuild will take the same amount of time as first build)
(this is good for production environment) type:

`docker build --squash="true" -t pixel-perfect .` 

The **pixel-perfect** name used in above commands is only example image name. 
To remove intermediate images created by docker on build process, type:
 
`docker rmi -f $(docker images -f "dangling=true" -q)`

### Run image

To run created docker image on [localhost:8080](localhost:8080) type (parameter `-p 8080:80` is host:container port mapping)

`docker run --name pixel-perfect -p 8080:80 pixel-perfect &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).

### Run image on sub-domain

If you wan't run image as virtual-host on sub-domain you must setup [proxy](https://github.com/jwilder/nginx-proxy)
. You should install proxy and set sub-domain in this way:
 
 ```
 docker pull jwilder/nginx-proxy:alpine
 docker run -d -p 80:80 --name nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy:alpine
 ```
 
 And in your `/etc/hosts` file (linux) add line: `127.0.0.1 pixel-perfect.your-domain.com` or in yor hosting add
 folowwing DNS record (wildchar `*` is handy because when you add new sub-domain in future, you don't need touch/add any DNS record)
  
 ```
 Type: CNAME 
 Hostname: *.your-domain.com
 Direct to: your-domain.com
 TTL(sec): 43200 
 ```

And now you are ready to run image on subdomain by:

```
docker run -e VIRTUAL_HOST=pixel-perfect.your-domain.com --name pixel-perfect pixel-perfect &
```

### Login into docker container

`docker exec -t -i pixel-perfect /bin/bash`


# Server

Below we see few npm commands to build and run application on dev, prod and aot

```bash
# development
npm run server

# production
npm run build:prod

# Aot build
npm run build:aot

# run last aot or prod build
npm run server:prod
```

### Run unit test
```bash
npm run test
```

### Run tests end-to-end (e2e - selenium)
First we need to run server in separate terminal by **npm start** and in new terminal
```bash
npm run e2e
```
This will open browser and start play test (click simulation on browser)

___

# License
 [MIT](/LICENSE)
