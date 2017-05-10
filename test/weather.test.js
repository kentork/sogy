import test from 'ava'
import moxios from 'moxios'

import weather from '../lib/weather/api.js'


const EXISTS = {
  name: '仙台',
  code: '040010'
}

const NOT_EXISTS = {
  name: 'ニューヨーク'
}


test.beforeEach(t => {
  moxios.install()
})
test.afterEach(t => {
  moxios.uninstall()
})


test('reject when you pass a location which doesn not exist in location.json', async t => {
  await t.throws(weather.ask(NOT_EXISTS.name))
})

test.serial('reject when you recieve a non 200 code from weather forecast api', async t => {
  moxios.stubRequest(`http://weather.livedoor.com/forecast/webservice/json/v1?city=${EXISTS.code}`, {
    status: 404,
    responseText: {}
  })

  await t.throws(weather.ask(EXISTS.name))
})

test.serial('return a forecast', async t => {
  moxios.stubRequest(`http://weather.livedoor.com/forecast/webservice/json/v1?city=${EXISTS.code}`, {
    status: 200,
    responseText: {
      description: 'forecast'
    }
  })

  t.true(await weather.ask(EXISTS.name) === 'forecast')
})

