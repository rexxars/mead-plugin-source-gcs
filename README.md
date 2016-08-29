# mead-plugin-source-gcs

Google Cloud Storage source for the Mead image transformer service - loads images from a GCS bucket.

## Installation

```shell
npm install --save mead-plugin-source-gcs
```

## Usage

Your mead configuration file (`mead --config <path-to-config.js>`):

```js
module.exports = {
  // Load the plugin
  plugins: [
    require('mead-plugin-source-gcs')
  ],

  // Define a source using GCS
  sources: [
    {
      name: 'my-gcs-source',
      adapter: 'gcs',
      config: {
        projectId: 'some-project-123',
        pathPrefix: 'photos', // Optional
        bucket: 'my-bucket-name',

        // Either provide `keyFilename` or `credentials`
        // (`credentials` being the contents of a key file)
        keyFilename: '/path/to/gcs-key.json'
      }
    }
  ]
}
```

## License

MIT-licensed. See LICENSE.
