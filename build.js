import { buildSync } from 'esbuild'

buildSync({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: 'dist/index.js',
})

buildSync({
  entryPoints: ['./src/index.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/index.min.js',
})
