import test from 'ava'
import sinon from 'sinon'
import moxios from 'moxios'

import a3rtCreator from '../lib/a3rt/api.js'
const a3rt = a3rtCreator('TOKEN_STRING')


test.beforeEach(t => {
  moxios.install()
})
test.afterEach(t => {
  moxios.uninstall()
})


test.serial('return a panic message', async t => {
  moxios.stubRequest(`https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk`, {
    status: 200,
    responseText: {
      status: 0,
      results: [
        {
          reply: '気の利いたコメント'
        }
      ]
    }
  })

  t.true(await a3rt.talk('理解できるテキスト') === '気の利いたコメント')
})

test.serial('return message for unintelligible', async t => {
  moxios.stubRequest(`https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk`, {
    status: 200,
    responseText: { status: 2000 }
  })

  t.true(await a3rt.talk('理解不能なテキスト') === 'あ、そういうの分かんないんで')
})

test.serial('return a panic message', async t => {
  moxios.stubRequest(`https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk`, {
    status: 200,
    responseText: { status: 5000  }
  })

  t.true(await a3rt.talk('エラーコードレスポンス') === '故障中！故障中！')
})
