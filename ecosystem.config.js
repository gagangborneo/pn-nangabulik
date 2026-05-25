module.exports = {
  apps: [
    {
      name: 'pn-nangabulik',

      script: './.next/standalone/server.js',

      cwd: '/www/wwwroot/landing-pn-nangabulik',

      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      autorestart: true,

      watch: false,

      max_memory_restart: '700M',

      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,

      time: true,

      kill_timeout: 5000,
    },
  ],
};