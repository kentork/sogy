import test from 'ava'
import moxios from 'moxios'

import apiCreator from '../../lib/docomo/api.js'
const token = 'TOKEN_STRING'
const api = apiCreator(token)


test.beforeEach(t => {
  moxios.install()
})
test.afterEach(t => {
  moxios.uninstall()
})


test.serial('the understanding function returns statuses', async t => {
  moxios.stubRequest(`https://api.apigw.smt.docomo.ne.jp/sentenceUnderstanding/v1/task?APIKEY=${token}`, {
    status: 200,
    responseText: {
      dialogStatus: 'status'
    }
  })

  t.true(await api.understanding('text', 'user') === 'status')
})

test.serial('the understanding function returns reject promise when server responses has an error code', async t => {
  moxios.stubRequest(`https://api.apigw.smt.docomo.ne.jp/sentenceUnderstanding/v1/task?APIKEY=${token}`, {
    status: 404,
    responseText: {}
  })

  await t.throws(api.understanding('text', 'user'))
})


test.serial('the conversation function returns utt', async t => {
  moxios.stubRequest(`https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=${token}`, {
    status: 200,
    responseText: {
      utt: 'status'
    }
  })

  t.true(await api.conversation('text', 'user') === 'status')
})

test.serial('the conversation function returns reject promise when server responses has an error code', async t => {
  moxios.stubRequest(`https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=${token}`, {
    status: 404,
    responseText: {}
  })

  await t.throws(api.conversation('text', 'user'))
})
