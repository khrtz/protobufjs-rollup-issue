const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');

rollup.rollup({
  input: 'index.mjs',
  external: ['protobufjs'],
  plugins: [
    node({
      browser: true,
    }),
    html({
      template: 'index.html',
      filename: 'index.html'
    }),
    globals(),
    builtins(),
  ],
}).then(
  (bundle) => {
    console.log('build now', build)
    bundle.wrire({
      format: 'umd',
      dest: 'static/build.js'
    });
  },
  (e) => console.log('Error', e)
);
