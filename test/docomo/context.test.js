import test from 'ava'
import sinon from 'sinon'
import tk from 'timekeeper'
import rewire from 'rewire'

import docomo from '../../lib/docomo/context.js'
const docomoFuncs = rewire('../../lib/docomo/context.js')


const CONTEXT = {
  user: 'one',
  hash: 'AAAAAAAAA'
}
const BEFORE = new Date('2000-10-01T03:24:00')
const AFTER = new Date('2000-10-01T03:24:31')


test('generated hashes is different', t => {
  const generateHash = docomoFuncs.__get__('generateHash')

  const one = generateHash()
  const two = generateHash()

  t.true(one !== two)
  t.true(one.length === two.length)
})


test('set context correctly', t => {
  docomo.setContext(CONTEXT.user, CONTEXT.hash)

  t.true(docomo.__contexts[CONTEXT.user] !== undefined)
  t.true(docomo.__contexts[CONTEXT.user].hash === CONTEXT.hash)
})


test('get context correctly', t => {
  docomo.setContext(CONTEXT.user, CONTEXT.hash)
  const context = docomo.getContext(CONTEXT.user)

  t.true(context === CONTEXT.hash)
})


test('get another hash after 30 secounds', t => {
  tk.freeze(BEFORE)

  docomo.setContext(CONTEXT.user, CONTEXT.hash)
  const one = docomo.getContext(CONTEXT.user)
  const two = docomo.getContext(CONTEXT.user)

  tk.freeze(AFTER)

  const three = docomo.getContext(CONTEXT.user)

  t.true(one === two)
  t.true(two !== three)

  tk.reset()
})
