![Alt AIRAVANA](./src/assets/img/airavana-logo.png?raw=true "Optional Title")



# Airavana web page
 
Based on [angular2 webpack starter](https://github.com/AngularClass/angular2-webpack-starter) 2017-03-08 [commit 55d4325](https://github.com/AngularClass/angular2-webpack-starter/tree/55d4325aad6caae60e9a15749f1d15953a9f51d6).


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

# start the server
npm start

# use Hot Module Replacement
```
go to [http://0.0.0.0:3333](http://0.0.0.0:3333) or [http://localhost:3333](http://localhost:3333) in your browser

# Table of Contents
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
* [License](#license)


# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v4.x.x`+ (or `v5.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)


### server
```bash
# development
npm run server

# production
npm run build:prod

# Aot build
npm run build:aot

# run
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
