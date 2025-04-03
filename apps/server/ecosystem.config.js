module.exports = {
  apps: [
    {
      name: 'admin-api',
      script: 'dist/main.js',
      //   instances: 'max',
      // 多实例有很多分布式问题要解决，所以先用单实例
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // 生产环境应该关闭watch功能
      // watch: ['dist'],
      // ignore_watch: ['dist/common/config'],
      watch: false,
      max_memory_restart: '4G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'log/pm2-error.log',
      out_file: 'log/pm2-out.log',
      log_file: 'log/pm2-combined.log',
      combine_logs: true,
      merge_logs: false,
      autorestart: true,
    },
  ],
}
