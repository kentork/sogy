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

## manually

```bash
sudo apt-get update
sudo apt-get install git
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone https://github.com/kentork/sogy

cd sogy
npm install

sudo npm install pm2 -g
pm2 start index.js
```
