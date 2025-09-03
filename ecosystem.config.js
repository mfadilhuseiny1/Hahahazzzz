module.exports = {
  apps: [{
    name: 'ai-chatbot',
    script: 'pnpm',
    args: 'start',
    cron_restart: '0 */1 * * *', // Auto restart setiap 1 jam
    max_memory_restart: '800M',
    env_file: '.env',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
