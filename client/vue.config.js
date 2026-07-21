const Dotenv = require('dotenv-webpack');
module.exports = {
    // webpack 4 can't parse modern syntax (?. / ??) in these deps' dist files;
    // remove once migrated to Vite
    transpileDependencies: ['vue-router', 'vuex', '@vue'],
    configureWebpack: {
      plugins: [
        new Dotenv()
      ]
    }
  }
