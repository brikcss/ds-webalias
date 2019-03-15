/*! .bundlesrc.js | @author Brikcss (https://github.com/brikcss) | @reference (https://github.com/bundles/core) */

const path = require('path')
const data = require('./.bundles-data.js')

// -------------------------------------------------------------------------------------------------
// Main config.
//

const config = {
  options: {
    // Only run seed bundle by default.
    run: ['seed']
  },
  bundles: [
    {
      id: 'repo',
      input: ['.repo'],
      bundlers: [{
        run: '@bundles/bundles-output',
        options: {
          to: outputCallback,
          root: '.repo'
        }
      }]
    },
    {
      id: 'seed',
      input: ['.seed'],
      bundlers: [{
        run: '@bundles/bundles-filters',
        filters: [{
          reverse: true,
          pattern (file) {
            const data = file.data
            return (file.source.path === '.seed/src/cli.js' && !data.features.cli) ||
              (file.source.path === '.seed/.rolluprc.js' && !data.features.rollup) ||
              (['.seed/.browsersyncrc.js', '.seed/.shotsrc.js', '.seed/.browserslistrc'].includes(file.source.path) && !data.features.browser) ||
              (['.seed/.postcssrc.js', '.seed/.stylelintrc.js'].includes(file.source.path) && !data.features.css) ||
              (file.source.path === '.seed/.jestrc.js' && !data.features.jest)
          }
        }]
      }, {
        run: '@bundles/bundles-ejs'
      }, {
        run: '@bundles/bundles-banner'
      }, {
        run: '@bundles/bundles-banner',
        options: {
          include: ['.yml'],
          prefix: '#! ',
          suffix: ' #'
        }
      }, {
        run: '@bundles/bundles-output',
        options: {
          root: '.seed',
          to: outputCallback
        }
      }],
      data
    }
  ]
}

// -------------------------------------------------------------------------------------------------
// Helpers.
//

/**
 * Used with output bundler to check for .ejs file extension and rename file.
 * @param  {Object} file  File Object.
 * @return {String}  Path to output file to.
 */
function outputCallback (file) {
  const ext = path.extname(file.source.path)
  const base = path.basename(file.source.path)
  // Rename *.*.ejs to *.*.
  if (ext === '.ejs' && base.includes('.')) {
    file.to = file.source.path.slice(0, ext.length)
  } else {
    file.to = file.source.path
  }
  return file.to
}

// -------------------------------------------------------------------------------------------------
// Exports.
//

module.exports = config
