module.exports = {
  apps: [
    {
      name: "elsa-bot",
      script: "start.js",
      watch: false,
      env: { NODE_ENV: "production" },
      max_restarts: 20,
      exp_backoff_restart_delay: 2000
    }
  ]
}
