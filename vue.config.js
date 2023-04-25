const { defineConfig } = require('@vue/cli-service');
const UnoCSS = require('@unocss/webpack').default;

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: config => {
    config.plugins.push(UnoCSS());
    config.optimization.realContentHash = true;
  }
});
