import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/withPromises.js',
    output: {
      file: pkg.browser,
      format: 'umd',
    },
    external: ['react'],
    globals: {
      react: 'React',
    },
    name: 'reactHocPromises',
    plugins: [
      resolve(), // so Rollup can find `react`
      babel({
        exclude: ['node_modules/**'],
      }),
      commonjs(), // so Rollup can convert `react` to an ES module
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: 'src/withPromises.js',
    output: { file: pkg.main, format: 'cjs' },
    external: ['react'],
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
  {
    input: 'src/withPromises.js',
    external: ['react'],
    output: { file: pkg.module, format: 'es' },
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
