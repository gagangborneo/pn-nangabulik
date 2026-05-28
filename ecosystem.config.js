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
        HOSTNAME: '0.0.0.0',
        // Larger libuv thread pool for outbound HTTP + Prisma I/O
        UV_THREADPOOL_SIZE: 16,
        // Force IPv4 first — some VPS providers have flaky IPv6 to upstream WordPress
        NODE_OPTIONS: '--dns-result-order=ipv4first',
      },

      autorestart: true,
      watch: false,

      // Backoff so a crash loop doesn't hammer the box
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '30s',

      max_memory_restart: '700M',

      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      kill_timeout: 10000,
      listen_timeout: 10000,
      wait_ready: false,
    },
  ],
};
