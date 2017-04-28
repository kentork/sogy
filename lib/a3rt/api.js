const axios = require('axios');
const querystring = require('querystring')


if (!process.env.RECRUIT_TALK_API_TOKEN) {
  console.log('Error: A3RT token is not found in environment variables.')
  process.exit(1)
}

exports.talk = (text) => {
  return axios.post(
    "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
    querystring.stringify({ apikey: process.env.RECRUIT_TALK_API_TOKEN, query: text })
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
