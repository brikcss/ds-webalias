/*! .rolluprc.js | @author Brikcss (https://github.com/brikcss) | @reference (https://rollupjs.org) */

// -------------------------------------------------------------------------------------------------
// Imports and setup.
//

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser as uglify } from 'rollup-plugin-terser'
import merge from '@brikcss/merge'
import pkg from './package.json'

// Configuration helpers.
const isProd = ['production', 'test'].includes(process.env.NODE_ENV)

// -------------------------------------------------------------------------------------------------
// User configuration.
// Modify this section to your needs.
//

// Configs: Each config will create a rollup config, and accepts all the properties that a normal
// rollup config accepts. It also accepts a `target` property, which determines the BabelJS preset
// environment configuration.
//
// @param {string|string[]} target  Intended target. Accepts: 'modern' (for browsers), 'legacy'
//     (for browsers), 'esm' (for bundlers), 'cjs' (for node), or falsy (no Babel).
const configs = [{
  target: null,
  output: {
    format: 'esm',
    file: pkg.module
  }
}, {
  target: 'modern',
  output: [{
    format: 'umd',
    file: pkg.browser
  }, {
    format: 'esm',
    file: pkg.module.replace('.js', '.browser.js')
  }]
}, {
  target: 'legacy',
  output: {
    format: 'umd',
    file: pkg.browser.replace('.js', '.legacy.js')
  }
}, {
  target: 'modern',
  input: 'node_modules/hyperhtml/esm',
  output: {
    name: 'brikcss.html',
    exports: 'named',
    format: 'umd',
    file: 'lib/hyperhtml.js'
  }
}, {
  target: 'legacy',
  input: 'node_modules/hyperhtml/esm',
  output: {
    name: 'brikcss.html',
    exports: 'named',
    format: 'umd',
    file: 'lib/hyperhtml.legacy.js'
  }
}]

// Base configuration. These are other configuration properties that may need to be modified.
const config = {
  // Minimum version of node to support.
  node: '9',
  // Levels of browser support.
  browsers: {
    modern: ['Chrome >= 61', 'Firefox >= 60', 'Safari >= 10.1', 'Edge >= 16'],
    legacy: ['IE 11', 'Chrome < 61', 'Firefox < 60', 'Safari < 10.1', 'Edge < 16']
  },
  // Map formats to their package.json keys.
  formatMap: {
    esm: 'module',
    cjs: 'main',
    umd: 'umd'
  },
  // Base configuration to merge with each config.
  base: {
    input: 'src/webalias.js',
    external: [...Object.keys(pkg.dependencies)],
    watch: {
      chokidar: true,
      include: 'src/**',
      exclude: 'node_modules/**',
      clearScreen: true
    },
    output: {
      compact: isProd,
      sourcemap: !isProd,
      banner: '/*! webalias.js | @author Brikcss (https://github.com/brikcss) | @reference (https://github.com/brikcss/webalias) */\n'
    }
  },
  /**
   * Set output defaults for groups where key is <format>:<target> (target is optional).
   */
  // Output defaults for 'umd' format.
  umd: {
    name: 'brikcss.elements',
    globals: {
      '@brikcss/element': 'brikcss',
      hyperhtml: 'brikcss.html'
    }
  },
  // Output defaults for 'esm:modern' format.
  'esm:modern': {
    paths: (id) => `https://unpkg.com/${id}@${pkg.dependencies[id]}?module`
  }
}

// -------------------------------------------------------------------------------------------------
// Utility functions. They do the heavy lifting.
//

/**
  * Creates plugins for use in a rollup config.
  *
  * @param  {(Array|string)}  [target='modern']  Intended target(s): 'modern'|'legacy'|'esm'|'cjs'
  * @return {Array}  Array of rollup plugins.
  */
function createPlugins (target = 'modern') {
  let plugins = []
  let babelPreset = {
    targets: {},
    loose: false,
    modules: false,
    debug: false,
    useBuiltIns: false,
    include: [],
    exclude: []
  }

  // Determine babel targets.
  if (!target) {
    babelPreset = undefined
  } else {
    if (target.includes('cjs')) {
      babelPreset.targets.node = config.node
      // babelPreset.modules = 'cjs'
    }
    if (target.includes('legacy')) {
      babelPreset.targets.browsers = config.browsers.legacy
      // babelPreset.modules = 'umd'
    } else if (target.includes('modern')) {
      babelPreset.targets.browsers = config.browsers.modern
      // babelPreset.modules = 'umd'
    }
    if (target.includes('esm')) {
      babelPreset.targets.browsers = config.browsers.modern
      // babelPreset.modules = false
    }
  }

  // Add common plugins for all targets.
  if (target) {
    plugins.push(resolve(), commonjs())
    // If babelPreset is truthy, add babel.
    if (babelPreset) {
      plugins.push(babel({
        presets: [
          ['@babel/preset-env', babelPreset]
        ]
        // runtimeHelpers: true,
        // exclude: ['node_modules/@babel/runtime/**', 'node_modules/core-js/**'],
        // plugins: ['@babel/plugin-transform-runtime']
      }))
    }
  }

  // Minimize in production.
  if (isProd) plugins.push(uglify())

  // Return the plugins.
  return plugins
}

/**
 * Create config output(s).
 *
 * @param   {(Array|object)}  [output={}]  Config output.
 * @param   {(Array|string)}  target  Intended target: 'modern'|'legacy'|'esm'|'cjs'.
 * @return  {(Array|object)}  Config output.
 */
function createOutput (output = {}, target) {
  if (!(output instanceof Array)) output = [output]
  // Create default properties for each output.
  output = output.map(o => {
    if (config[o.format]) o = merge({}, config[o.format], o)
    if (config[o.format + ':' + target]) o = merge({}, config[o.format + ':' + target], o)
    if (!o.file) o.file = pkg[config.formatMap[o.format]]
    return o
  })
  // Return array if more than one output; otherwise return object.
  return output.length > 1 ? output : output[0]
}

/**
 * Create a single rollup config.
 *
 * @param  {object}  [result={}]  User config.
 * @return {object}  Rollup config object.
 */
function createConfig (result = {}) {
  // Merge config with base config.
  result = merge([{}, config.base, result], { arrayStrategy: 'overwrite' })
  if (result.output instanceof Array) {
    result.output = result.output.map((output) => merge({}, config.base.output, output))
  }

  // Create output(s).
  result.output = createOutput(result.output, result.target)

  // Create plugins based on target(s).
  if (!result.plugins) {
    result.plugins = createPlugins(result.target, result.output instanceof Array ? result.output[0].format : result.output.format)
  }

  // Return the result.
  delete result.target
  return result
}

// -------------------------------------------------------------------------------------------------
// Exports.
//

const rollupConfigs = configs.map(createConfig)
export default rollupConfigs
