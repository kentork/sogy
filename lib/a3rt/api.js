const axios = require('axios');
const querystring = require('querystring')


module.exports = (token) => {
  return {
    talk: (text) => {
      return axios.post(
        "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
        querystring.stringify({ apikey: token, query: text })
      )
      .then(response => {
        if(response.data.status === 0 ) {
          return response.data.results[0].reply
        } else if(response.data.status === 2000 ) {
          return 'あ、そういうの分かんないんで'
        } else {
          return '故障中！故障中！'
        }
      })
    }
  }
}

