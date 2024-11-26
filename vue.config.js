// const { defineConfig } = require('@vue/cli-service'); // Remove this line
module.exports = {
  devServer: {
    client: {
      webSocketURL: {
        protocol: 'wss',
        hostname: 'solid-space-journey-5946xq9495f994-8080.app.github.dev',
        port: 443,
      },
    },
  },
}