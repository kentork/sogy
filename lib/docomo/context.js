const moment = require('moment')


let contexts = {}

module.exports = {
  getContext: (user) => {
    if (user in contexts) {
      const context = contexts[user]
      const now = new moment()

      if (now.diff(context.time, 'seconds') > 30) {
        return generateHash()
      } else {
        return context.hash
      }
    } else {
      return generateHash()
    }
  },
  setContext: (user, hash) => {
    contexts[user] = {
      hash,
      time: new moment()
    }
  },

  // for tests
  __contexts: contexts
}


function generateHash() {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let hash = ''
  for (let i = 0; i < 20; i++) {
    hash += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  return hash
}
