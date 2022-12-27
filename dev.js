import { serve } from 'esbuild'

serve({
  port: 3000,
  servedir: '.',
}, {
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: 'dist/index.js',
}).then(result => {
  console.log('dev server listening on http://localhost:' + result.port);
})
