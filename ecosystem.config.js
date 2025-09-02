module.exports = {
  apps: [{
    name: 'ai-chatbot',
    script: 'npm',
    args: 'start',
    cron_restart: '0 */2 * * *', // Auto restart setiap 2 jam
    max_memory_restart: '800M',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
