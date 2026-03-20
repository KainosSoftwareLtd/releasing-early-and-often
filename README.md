# Releasing Early and Often

This contains the starting base packages for the course on releasing early and often.

Included is also an optional setup script if you do not have the appropriate tools installed - namely node v24 and java 21.

## Tech

* Node v24
* Java 21

If you have working versions of these, feel free to ignore the setup scripts

## Prerequisites for setup script

* zsh: The scripts must be run in a zsh shell
* nvm - https://github.com/nvm-sh/nvm
* sdkman - https://get.sdkman.io

## Setup 

Execute setup:

Make script executable
```shell
chmod +x install.sh
```

Run setup script
```shell
./install.sh
```

This will use NVM & SDKman to install versions of node and java to use for this project, set them to the default and then run nvm install & maven install to get them up and running.

## Common issues
If on your project you connect to other repositories using node you might need to run the below command to clean out your cache:
```shell
npm cache clean --force
```

If you use other tools for controlling java versions instead of SDKman you might have conflicts running maven - one such example is using jenv where you will need to run the below to use SDKman java versions through maven:
```shell
jenv disable-plugin maven
```
