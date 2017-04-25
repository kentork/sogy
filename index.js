require('dotenv').config()
const Botkit = require('botkit');
const request = require('request');


if (!process.env.SLACK_API_TOKEN || !process.env.RECRUIT_TALK_API_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({ debug: true });
controller.spawn({ token: process.env.SLACK_API_TOKEN }).startRTM(function(err){
  if (err) {
    throw new Error(err);
  }
});


// comunications
controller.hears(
  '',
  ['direct_message', 'direct_mention', 'mention'],
  function(bot, message) {
    const options = {
      uri: "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      json: true,
      form: {
        "apikey": process.env.RECRUIT_TALK_API_TOKEN,
        "query": message.text
      }
    };

    request.post(options, function(error, response, body){
      if(body.status === 0 ) {
        bot.reply(message, body.results[0].reply);
      } else if(body.status === 2000 ) {
        bot.reply(message, 'あ、そういうの分かんないんで');
      } else {
        bot.reply(message, '故障中！故障中！');
      }
    });
  }
);

