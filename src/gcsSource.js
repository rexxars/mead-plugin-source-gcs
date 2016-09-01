const Boom = require('boom')
const storage = require('@google-cloud/storage')
const authFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_id']

function gcsSource(config) {
  const {keyFilename, credentials, projectId} = config
  const pathPrefix = (config.pathPrefix || '').replace(/^\/|\/$/g, '')

  if (!keyFilename && !hasAuthFields(credentials)) {
    throw new Error(
      'GCS sources need either a `keyFilename` or a `credentials` object'
    )
  }

  ['bucket', 'projectId'].forEach(prop => {
    if (!config[prop]) {
      throw new Error(`GCS sources need a \`${prop}\` property`)
    }
  })

  const authConfig = keyFilename ? {keyFilename} : {credentials}
  const clientConfig = Object.assign({projectId}, authConfig)
  const gcs = storage(clientConfig)
  const bucket = gcs.bucket(config.bucket)

  return {getImageStream, requiresSignedUrls: false}

  function getImageStream(urlPath, callback) {
    const imgPath = `${pathPrefix}/${urlPath}`.replace(/\/\//, '/').replace(/^\/+/, '')
    const stream = bucket.file(imgPath).createReadStream()
      .on('error', err => callback(Boom.wrap(err, err.code, 'GCS: ')))
      .on('readable', () => callback(null, stream))
  }
}

function hasAuthFields(config = {}) {
  return authFields.every(field => config[field])
}

module.exports = {
  name: 'gcs',
  type: 'source',
  handler: gcsSource
}
