import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import html from 'rollup-plugin-template-html';
import serve from 'rollup-plugin-serve';
import re from 'rollup-plugin-re';
const babel = require('rollup-plugin-babel');
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';

export default {
  input: './index.mjs',
    plugins: [
      node({
        browser: true,
        preferBuiltins: true,
        main: true,
      }),
      babel({
        babelrc: false,
        presets: [["es2015-rollup"]],
        runtimeHelpers: true
      }),
      // through error in protojs
      re({
        patterns: [
          {
            match: /types\.js$/,
            test: /util\.emptyArray/,
            replace: 'Object.freeze ? Object.freeze([]) : []'
          },
          {
            match: /root\.js/,
            test: /util\.path\.resolve/,
            replace: 'require("@protobufjs/path").resolve'
          }
        ]
      }),
      html({
        template: 'index.html',
        filename: 'index.html'
      }),
      // Polyfill require() from dependencies.
      commonjs({
        include: 'node_modules/**',  // Default: undefined
        namedExports: { 'axios': ['axios' ] },  // Default: undefined
      }),
      globals(),
      builtins(),
      json(),
      serve({
        port: 5001,
        verbose: true,
        contentBase: './static'
      })
    ],
    output: {
      format: 'umd',
      file: 'static/build.js',
      external: [
        'protobufjs'
      ]
    },
    onwarn: warning => {
      let {code} = warning;
      if (code === 'CIRCULAR_DEPENDENCY' ||
          code === 'CIRCULAR' || code === 'EVAL') {
        return;
      }
      console.warn('WARNING: ', warning.toString());
    }
};