/**
 * PM2 Configuration for Production
 * Proper restart strategy for Next.js standalone
 */
module.exports = {
  apps: [
    {
      name: 'pn-nangabulik',
      script: './.next/standalone/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart strategy
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
    },
  ],

  // Deploy section
  deploy: {
    production: {
      user: 'www',
      host: '103.127.133.230',
      ref: 'origin/main',
      repo: 'https://github.com/gagangborneo/pn-nangabulik.git',
      path: '/www/wwwroot/landing-pn-nangabulik',
      'post-deploy':
        'npm install && npm run build && pm2 restart ecosystem.config.js --env production',
    },
  },
};
