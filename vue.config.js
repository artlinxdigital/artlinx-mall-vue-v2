module.exports = {
  productionSourceMap: false,
  devServer: {
    // 默认会自动打开浏览器
    open: true,
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/prod-api/profile/avatar": {
        target: "http://194.26.222.42:8082/uploads/avatar",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/prod-api/profile/avatar": "",
        },
      },
      "/blockChain": {
        target: "http://ctblock.cn/blockChain",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/blockChain": "",
        },
      },
      "/mall": {
        // target: "http://artlinx.uk:4001/mall",
        target: "http://localhost:4001/mall",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/mall": "",
        },
      },
    },
  },
};
