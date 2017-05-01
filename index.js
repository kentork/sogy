require('dotenv').config()
if (!process.env.SLACK_API_TOKEN) {
  console.log('Error: slack token is not found in environment variables.')
  process.exit(1)
}
if (!process.env.APIAI_TOKEN) {
  console.log('Error: api.ai token is not found in environment variables.')
  process.exit(1)
}
if (!process.env.RECRUIT_TALK_API_TOKEN) {
  console.log('Error: A3RT token is not found in environment variables.')
  process.exit(1)
}


const Botkit = require('botkit')
const AI = require('./lib/apiai/api.js')(
  process.env.APIAI_TOKEN,
  process.env.RECRUIT_TALK_API_TOKEN
)


// Create Botkit controller
const controller = Botkit.slackbot({ debug: process.env.NODE_ENV === 'development' })

controller
  .spawn({ token: process.env.SLACK_API_TOKEN })
  .startRTM(err => {
    if (err) throw new Error(err)
  })


// Add a listener for mentions
controller.hears(
  '',
  ['direct_message', 'direct_mention', 'mention'],
  (bot, message) => {
    AI.guessIntent(
      message.text,
      message.user,
      text => bot.reply(message, text)
    )
  }
)
