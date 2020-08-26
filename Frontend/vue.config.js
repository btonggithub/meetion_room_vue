
module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: process.env.VUE_APP_NODE_URL,
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "/api" },
        logLevel: "debug",
      },
    },
  },
};
