/*! .rolluprc.js | @author Brikcss (https://github.com/brikcss) | @reference (https://rollupjs.org) */

// -------------------------------------------------------------------------------------------------
// Imports and setup.
//

import configGen from '@brikcss/rollup-config-generator'

/**
 * Generate configs with a simple configuration object or array.
 *
 * @param {String} [type=undefined]  Type of config: 'browser'|'node'.
 * @param {String} [target=undefined]  Target environment: 'modern'(browser),'legacy'(browser),'#'(node).
 * @param {String} [id=undefined]  Id/name of module. This determines the file name.
 */
export default configGen.create([
  {
    type: 'browser',
    input: 'src/webalias.js',
    output: {
      banner: configGen.createBanner()
    }
  }, {
    type: 'dependency',
    pkg: require('./node_modules/lighterhtml/package.json'),
    input: 'lighterhtml'
  }
], {
  umd (output, config) {
    config.context = 'window || global'
    output.exports = 'named'
    output.name = config.pkg.name === 'lighterhtml' ? 'brikcss.lighterhtml' : 'brikcss.elements'
    output.globals = {
      '@brikcss/element': 'brikcss',
      lighterhtml: 'brikcss.lighterhtml'
    }
    return output
  },
  'esm:modern': {
    paths: (id) => {
      if (id === '@brikcss/element') return '../../node_modules/@brikcss/element/dist/esm/brik-element.js'
      return `./${id.includes('/') ? id.split('/')[1] : id}.js`
    }
  }
})
