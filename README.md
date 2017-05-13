[![Alt AIRAVANA](./src/assets/img/airavana-logo.png?raw=true "Optional Title")](http://airavna.net)




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
git clone --depth 1 https://KamilCFD@bitbucket.org/airavana/airavana.git

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
    * [Dependencies](#dependencies)
* [License](#license)


# Getting Started

This tool based on framework: [angular2 webpack starter](https://github.com/AngularClass/angular2-webpack-starter) 2017-03-08 [commit 55d4325](https://github.com/AngularClass/angular2-webpack-starter/tree/55d4325aad6caae60e9a15749f1d15953a9f51d6).

## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v4.x.x`+ (or `v5.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

# Docker

### Install Docker Mac OS

If your previous GUI-instalation not satisfy you, you can [uninstall it](https://therealmarv.com/how-to-fully-uninstall-the-offical-docker-os-x-installation/) (and all images) by:

``` bash
sudo rm -rf /Applications/Docker
sudo rm -f /usr/local/bin/docker
sudo rm -f /usr/local/bin/docker-machine
sudo rm -f /usr/local/bin/docker-compose
sudo rm -f /usr/local/bin/docker-credential-osxkeychain
sudo rm -rf ~/.docker
sudo rm -rf $HOME/Library/Containers/com.docker.docker  # here we delete stored images
```

And install fresh docker by:

`brew cask install docker`

And run docker by Mac bottom menu> launchpad > docker (in first run it want your password) 

### Install Docker on Ubuntu 16.4 (Digital ocean)

Below instrucions are based on this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04). After login (as no root user) execute below commands

```bash
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker  # test:  shoud be ‘active’

```

And add your user to docker group (to avoid `sudo` before using `docker` command in future):

```bash
sudo usermod -aG docker $(whoami)
```

and lougout and login again.


### Build image

To build docker image first we must create .env.js file as a copy of .env.example.js and edit (if not scripts in dockerfile make this copy automaticaly) 
Then we can choose between small image (but slow rebuild, ~25MB): 

`docker build -f Dockerfile-small -t kkielczewski/pixel-perfect:small .`

or fast image (fast rebuild, >400MB)

`docker build -f Dockerfile-fast -t kkielczewski/pixel-perfect:fast .`

We can also add url to .env.js file content in `JSENV_FILE_URL` parameter e.g.:

`docker build -f Dockerfile-small -t kkielczewski/pixel-perfect:small --build-arg JSENV_FILE_URL="https://raw.githubusercontent.com/kamil-kielczewski/pixel_perfect_helper/master/.env.example.js" .`

### Run image

To run image we use e.g:

`docker run --name pixel-perfect -p 8080:80 kkielczewski/pixel-perfect:small &`

To stop image (and remove container)

`docker rm -f pixel-perfect`

### Run image as virtual host

We will use [proxy](https://github.com/jwilder/nginx-proxy):

`docker pull jwilder/nginx-proxy:alpine`

And run it:

`docker run -d -p 80:80 --name nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy:alpine`

Now we shoud edit `/etc/hosts` file in our MacOs by adding following (or similar) line at the bottom:

`127.0.0.1 pixel-perfect.dev`

And now we can run container:

`docker run -e VIRTUAL_HOST=pixel-perfect.dev --name pixel-perfect kkielczewski/pixel-perfect:small &`

And in browser on adresss [http://pixel-perfect.dev](http://pixel-perfect.dev) we shoud see our application :)

### Connect to running container via cmd

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
