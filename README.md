# Sogy is an AI friends

[![CircleCI](https://circleci.com/gh/kentork/sogy.svg?style=svg)](https://circleci.com/gh/kentork/sogy)

## Prepare: get tokens and put `.env` file

This bot uses [Slack bot token](https://slack.com/apps/A0F7YS25R-bots), [api.ai client token](https://console.api.ai/api-client/) and [Recruit A3rt token](https://a3rt.recruit-tech.co.jp/product/talkAPI/)

If you got their tokens, you can use them to write to `.env` file.

```bash:.env
SLACK_API_TOKEN=your_slack_token
RECRUIT_TALK_API_TOKEN=your_a3rt_token
APIAI_TOKEN=your_apiai_token
```

## Run Bots

```bash
node index.js
```


# Configuration

##  Server settings

At first, create a deployment user.

```bash
sudo adduser deploy

sudo su - deploy
ssh-keygen -t rsa -b 4096
chmod 600 id_rsa
cat id_rsa.pub >> authorized_keys
chmod 600 authorized_keys
exit
```

Next, you create a node environment.

```bash
sudo apt-get update
sudo apt-get install git

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g
```

## pm2 setup

You have to initialize the server once for pm2.
To do so, you should setup node environment to another machine and be able to connect to it via ssh using the key created earlier.

> Note: In general, you can connect from development machine without problems, but if you develop on windows, you may not be able to connect properly via pm2, even if you [use linux subsystem](https://github.com/Unitech/pm2/issues/2322).

```bash
# copy private key created before to '~/.ssh/server'
chmod 600 server
```

```bash:~/.ssh/config
Host <<SERVER_IP>>
  User deploy
  IdentityFile ~/.ssh/server
```

```bash
git clone https://github.com/kentork/sogy.git
cd sogy
pm2 deploy production setup
# --> Deploying to production environment
# --> on host <<SERVER_IP>>
#   ○ hook pre-setup
#   ○ running setup
#   ○ cloning https://github.com/kentork/sogy.git
#   ...
```

## CI deployment

Once setup is done, you can deploy sources when ci runs tasks.

### Case: Circle CI

First, you register a ssh private key to `SSH Permissions` on project.

Next, you need to tell the server hostname via environment variables.
You can do it to set `SERVER_HOST:<<SERVER_IP>>` to `Environment Variables` on project.

The rest is only to add a deployment code to `circle.yml`.

```yaml:circle.yml
...
dependencies:
  pre:
    npm install -g pm2
...
deployment:
  production:
    branch: master
    commands:
      - pm2 deploy ecosystem.config.js production

```
