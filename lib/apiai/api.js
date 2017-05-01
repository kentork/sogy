const apiai = require('apiai')


module.exports = (apiaiToken, a3rtToken) => {
  const AI = apiai(apiaiToken, { language: 'jp' })
  const weather = require('../weather/api.js')
  const a3rt = require('../a3rt/api.js')(a3rtToken)


  function conversation(text, onReply) {
    return a3rt.talk(text)
      .then(text => onReply(text))
      .catch(error => console.log(error))
  }


  return {
    guessIntent: (text, user, onReply) => {
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
  }
}
