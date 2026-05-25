import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/sdk.js',
      format: 'iife',
      name: 'ConversionIQ',
      sourcemap: true,
    },
    {
      file: 'dist/sdk.min.js',
      format: 'iife',
      name: 'ConversionIQ',
      plugins: [terser()],
    }
  ],
  plugins: [
    typescript(),
    resolve(),
    commonjs()
  ]
};
