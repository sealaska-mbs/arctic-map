import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      dir: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      dir: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      dir: pkg.example,
      format: 'cjs',
      sourcemap: true
    },
    {
      dir: pkg.examplemodule,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    // "@babel/plugin-syntax-jsx", TODO: do we need this or just delete entirely? app seems to work without it
    external(),
   
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({ babelHelpers: 'bundled' }),
    resolve(),
    commonjs()
  ]

}
