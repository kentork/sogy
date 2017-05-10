const axios = require('axios');
const contextStore = require('./context.js')


module.exports = (docomoToken) => {
  const token = docomoToken

  return {
    understanding: (text, user) => {
      return axios.post(
        `https://api.apigw.smt.docomo.ne.jp/sentenceUnderstanding/v1/task?APIKEY=${token}`,
        {
          projectKey: "OSU",
          appInfo: {
            appName: "sogy",
            appKey: "sogy-app"
          },
          clientVer: "1.0.0",
          dialogMode: "off",
          language: "ja",
          userId: user,
          location: {
            lat: 0,
            lon: 0
          },
          userUtterance: {
            utteranceText: text
          }
        }
      )
        .then(response => {
          if (response.status == 200) {
            return response.data.dialogStatus
          } else {
            return Promise.reject(new Error(`Request error: response error code`))
          }
        })
    },
    conversation: (text, user) => {
      return axios.post(
        `https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=${token}`,
        {
          "utt": text,
          "context": contextStore.getContext(user),
          "mode": "dialog"
        }
      )
        .then(response => {
          if (response.status == 200) {
            contextStore.setContext(user, response.data.context)
            return response.data.utt
          } else {
            return Promise.reject(new Error(`Request error: response error code`))
          }
        })
    }
  }
}
