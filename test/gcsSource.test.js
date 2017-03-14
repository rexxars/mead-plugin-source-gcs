/* eslint-disable id-length, no-sync */
const fs = require('fs')
const path = require('path')
const test = require('tape')
const plugin = require('..')

const readStream = (stream, cb) => {
  const chunks = []
  stream
    .on('data', d => chunks.push(d))
    .on('error', cb)
    .on('end', () => cb(null, Buffer.concat(chunks)))
}

const keyFilename = path.join(__dirname, 'fixtures', 'keyFile.json')
const credentials = require(keyFilename)
const gcsSource = plugin.handler
const bucket = 'mead-tests'
const projectId = 'mead-141820'

// Set options for integration tests
const gcsKey = path.join(__dirname, 'fixtures', 'gcs-key.json')
const intOpts = {skip: true}
try {
  fs.statSync(gcsKey)
  intOpts.skip = false
} catch (e) {
  // Do nothing
}

test('has plugin props', t => {
  ['name', 'type', 'handler'].forEach(prop => {
    t.ok(plugin[prop])
  })
  t.end()
})

test('exposes source plugin props', t => {
  const src = gcsSource({keyFilename, bucket, projectId})
  t.equal(typeof src.getImageStream, 'function', 'exposes `getImageStream()`')
  t.equal(typeof src.requiresSignedUrls, 'boolean', 'exposes `requiresSignedUrls`')
  t.end()
})

test('does not require signed urls by default', t => {
  t.notOk(gcsSource({keyFilename, bucket, projectId}).requiresSignedUrls)
  t.end()
})

test('throws on missing `keyFilename` and `credentials`', t => {
  t.throws(() => gcsSource({bucket, projectId}), /keyFilename/)
  t.end()
})

test('throws on missing credential fields', t => {
  t.throws(() => gcsSource({credentials: {}, bucket, projectId}), /credentials/)
  t.end()
})

test('throws on missing bucket', t => {
  t.throws(() => gcsSource({keyFilename, projectId}), /bucket/)
  t.end()
})

test('throws on missing projectId', t => {
  t.throws(() => gcsSource({keyFilename, bucket}), /projectId/)
  t.end()
})

test('errors on invalid credentials', t => {
  gcsSource({projectId, bucket, credentials}).getImageStream({urlPath: 'some/image.png'}, (err, stream) => {
    t.ok(err instanceof Error, 'should callback with error')
    t.end()
  })
})

test('returns stream that retrieves a given image', intOpts, t => {
  const localBuf = fs.readFileSync(path.join(__dirname, 'fixtures', 'mead.png'))

  gcsSource({projectId, bucket, keyFilename: gcsKey, pathPrefix: '/photos/'})
    .getImageStream({urlPath: 'logos/mead.png'}, (err, stream) => {
      t.ifError(err, 'should not callback with error')
      readStream(stream, (readErr, remoteBuf) => {
        t.ifError(readErr, 'should not error on read')
        t.equal(Buffer.compare(localBuf, remoteBuf), 0, 'Remote and local images should match')
        t.end()
      })
    })
})

test('handles 404s as intended', intOpts, t => {
  gcsSource({projectId, bucket, keyFilename: gcsKey})
    .getImageStream({urlPath: 'photos/logos/nonexistant.png'}, err => {
      t.ok(err instanceof Error, 'should error')
      t.true(err.isBoom, 'should be boom error')
      t.equal(err.output.statusCode, 404, 'status code should be 404')
      t.end()
    })
})
