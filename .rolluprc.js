/*! .rolluprc.js | @author Brikcss (https://github.com/brikcss) | @reference (https://rollupjs.org) */

// -------------------------------------------------------------------------------------------------
// Imports and setup.
//

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser as uglify } from 'rollup-plugin-terser'
import pkg from './package.json'

// Flags.
const isProd = ['production', 'test'].includes(process.env.NODE_ENV)

// Set base options.
const base = {
  input: 'src/webalias.js',
  external: ['path'],
  plugins: [
    babel({
      exclude: ['node_modules/**'],
      presets: [['@babel/preset-env', {
        targets: {
          node: '8'
        }
      }]]
    }),
    isProd && uglify()
  ],
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: true
  }
}

// -------------------------------------------------------------------------------------------------
// Configs.
//

let configs = [
  // JS Module.
  {
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/@babel/runtime/**'],
        presets: [[
          '@babel/preset-env',
          {
            targets: {
              node: '8',
              browsers: ['last 2 versions', '> 2%']
            },
            modules: false
          }
        ]],
        runtimeHelpers: true,
        plugins: ['@babel/plugin-transform-runtime']
      })
    ]
  }
]

if (isProd) {
  configs.push([
    // UMD and Browser modules.
    {
      output: [{
        name: 'replicate',
        file: pkg.browser,
        format: 'iife'
      }, {
        name: 'replicate',
        file: pkg.umd,
        format: 'umd'
      }],
      plugins: [
        resolve(),
        commonjs(),
        babel({
          exclude: ['node_modules/**'],
          presets: [[
            '@babel/preset-env',
            {
              targets: {
                node: '8',
                browsers: ['last 2 versions', '> 2%']
              },
              modules: false
            }
          ]]
        }),
        isProd && uglify()
      ]
    }
  ])
}

// -------------------------------------------------------------------------------------------------
// Exports.
//

if (!(configs instanceof Array)) configs = [configs]
export default configs.map(config => Object.assign({}, base, config))
