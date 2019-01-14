import test from 'ava'
import { EmeraltAuthInMemory } from '@/index'
import { EmeraltDatabaseInMemory } from '@emeralt/database-inmemory'

const init = (mock = false) => {
  // @ts-ignore
  const database = EmeraltDatabaseInMemory({})({})

  const auth = EmeraltAuthInMemory({
    users: mock ? { username: 'password' } : {},
    // @ts-ignore
  })({}, database)

  return { auth, database }
}

test('init', async (t) => {
  const { auth } = await init()

  t.truthy(auth.createUser)
  t.truthy(auth.deleteUser)
  t.truthy(auth.comparePassword)
  t.truthy(auth.canUser)
})

test('init (with users) [& comparePassword]', (t) => {
  const { auth } = init(true)

  t.true(auth.comparePassword('username', 'password'))
})

test('createUser [& comparePassword]', (t) => {
  const { auth } = init()

  t.true(auth.createUser('username', 'password'))

  t.true(auth.comparePassword('username', 'password'))
})

test('createUser (reject duplicate) [& comparePassword]', (t) => {
  const { auth } = init()

  t.true(auth.createUser('username', 'password'))

  t.false(auth.createUser('username', 'password-2'))

  t.true(auth.comparePassword('username', 'password'))
})

test('[deleteUser]', async (t) => {
  const { auth } = init()

  auth.createUser('username', 'password')

  t.true(auth.deleteUser('username'))
  t.true(auth.createUser('username', 'password'))
})

test('[deleteUser] nonexistent user', async (t) => {
  const { auth } = init()

  t.false(auth.deleteUser('tester'))
})

test('comparePassword', async (t) => {
  const { auth } = init(true)

  t.true(await auth.comparePassword('username', 'password'))
})

test('comparePassword (nonexistent user)', async (t) => {
  const { auth } = init()

  t.false(await auth.comparePassword('username', 'password'))
})

test('comparePassword (wrong password)', async (t) => {
  const { auth } = init(true)

  t.false(await auth.comparePassword('username', 'wrong-password'))
})

test('canUser (nonexistent user)', async (t) => {
  const { auth } = init()

  t.false(await auth.canUser('username', 'publish', 'abcdef'))
})

test('canUser', async (t) => {
  const { auth, database } = init(true)

  // @ts-ignore
  database.setKey(['metadata', 'abcdef'], { _owner: 'asd' })

  t.false(await auth.canUser('username', 'publish', 'abcdef'))
})

test('canUser (nonexistent package)', async (t) => {
  const { auth } = init(true)

  t.true(await auth.canUser('username', 'publish', 'abcdef'))
})
