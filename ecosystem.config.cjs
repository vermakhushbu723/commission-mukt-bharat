// pm2 process manifest for Commission-Mukt Bharat (Vite + React SPA).
// `serve` is installed globally on the host: `sudo npm i -g serve`.
// `-s` enables single-page-app fallback so client routes resolve to index.html.
// Use an absolute path + interpreter:'none' so pm2 doesn't mistake the word
// "serve" for its built-in `pm2 serve` (which would hijack the args).

module.exports = {
  apps: [
    {
      name: 'commission-mukt-bharat',
      script: '/usr/bin/serve',
      interpreter: 'none',
      args: ['-s', 'dist', '-l', String(process.env.PORT || 3000)],
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
    },
  ],
}
