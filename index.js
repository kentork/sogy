require('dotenv').config()
const Botkit = require('botkit')
const axios = require('axios')
const querystring = require('querystring')
const apiai = require('apiai')

const weather = require('./weather/api.js')


if (!process.env.SLACK_API_TOKEN || !process.env.RECRUIT_TALK_API_TOKEN || !process.env.APIAI_TOKEN) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const controller = Botkit.slackbot({ debug: true })
controller.spawn({ token: process.env.SLACK_API_TOKEN }).startRTM(err => {
  if (err) {
    throw new Error(err)
  }
})

const ai = apiai(process.env.APIAI_TOKEN, {language:'jp'})



// comunications
controller.hears(
  '',
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    const talk = ai.textRequest(
      message.text,
      { sessionId: message.user }
    )

    talk.on('response', response => {
      if (response.status.code === 200) {
        switch(response.result.action) {
          case 'question.weather':
            weather.askWeather(
              response.result.parameters.location,
              response.result.parameters.date
            )
            .then(text => {
              bot.reply(message, text)
            })
            .catch(error => {
              askRecruit(bot, message)
            })
            break
          case 'input.unknown':
            askRecruit(bot, message)
            break
          default:
            askRecruit(bot, message)
            break
        }
      } else {
        askRecruit(bot, message)
      }
    })
    talk.on('error', error => {
      askRecruit(bot, message)
    })
    talk.end()
  }
);


function askRecruit(bot, message) {
  return axios.post(
    "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
    querystring.stringify({ apikey: process.env.RECRUIT_TALK_API_TOKEN, query: message.text })
  )
  .then(response => {
    if(response.data.status === 0 ) {
      bot.reply(message, response.data.results[0].reply);
    } else if(response.data.status === 2000 ) {
      bot.reply(message, 'あ、そういうの分かんないんで')
    } else {
      bot.reply(message, '故障中！故障中！')
    }
  })
  .catch(error => {
    console.log(error)
  })
}
