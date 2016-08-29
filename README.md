# mead-plugin-source-gcs

[![npm version](http://img.shields.io/npm/v/mead-plugin-source-gcs.svg?style=flat-square)](http://browsenpm.org/package/mead-plugin-source-gcs)[![Build Status](http://img.shields.io/travis/rexxars/mead-plugin-source-gcs/master.svg?style=flat-square)](https://travis-ci.org/rexxars/mead-plugin-source-gcs)[![Coverage Status](https://img.shields.io/coveralls/rexxars/mead-plugin-source-gcs/master.svg?style=flat-square)](https://coveralls.io/github/rexxars/mead-plugin-source-gcs)[![Dependency status](https://img.shields.io/david/rexxars/mead-plugin-source-gcs.svg?style=flat-square)](https://david-dm.org/rexxars/mead-plugin-source-gcs)

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
