const axios = require('axios');


module.exports = (docomoToken) => {
  const api = require('./api.js')(docomoToken)

  const weather = require('../weather/api.js')

  return {
    guessIntent: (text, user, onReply) => {
      switch (true) {
        case /^質問/.test(text):
          api.question(text.substring(2))
            .then(text => onReply(text))
            .catch(error => onReply('故障中！故障中！'))
          break
        default:
          api.understanding(text, user)
            .then(intent => {
              switch (intent.command.commandName) {
                case '天気':
                  const location = intent.slotStatus.find(s => s.slotName == 'searchArea').slotValue
                  const date = intent.slotStatus.find(s => s.slotName == 'date').slotValue
                  weather.ask(location, date)
                    .then(text => onReply(text))
                    .catch(error => onReply('故障中！故障中！'))
                  break
                default:
                  api.conversation(text, user)
                    .then(text => onReply(text))
                    .catch(error => onReply('故障中！故障中！'))
                  break
              }
            })
            .catch(error => onReply('故障中！故障中！'))
          break
      }
    }
  }
}
