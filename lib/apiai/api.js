const apiai = require('apiai')

const weather = require('../weather/api.js')
const a3rt = require('../a3rt/api.js')


if (!process.env.APIAI_TOKEN) {
  console.log('Error: api.ai token is not found in environment variables.')
  process.exit(1)
}

const AI = apiai(process.env.APIAI_TOKEN, { language: 'jp' })


function conversation(text, onReply) {
  return a3rt.talk(text)
    .then(text => onReply(text))
    .catch(error => console.log(error))
}


exports.guessIntent = (text, user, onReply) => {
  const talk = AI.textRequest(text, { sessionId: user })

  talk.on('response', resp => {
    if (resp.status.code === 200) {
      switch(resp.result.action) {
        case 'question.weather':
          weather.ask(
            resp.result.parameters.location,
            resp.result.parameters.date
          )
          .then(text => onReply(text))
          .catch(error => conversation(text, onReply))
          break
        case 'input.unknown':
          conversation(text, onReply)
          break
        default:
          conversation(text, onReply)
          break
      }
    } else {
      conversation(text, onReply)
    }
  })
  talk.on('error', error => conversation(text, onReply))
  talk.end()
}
