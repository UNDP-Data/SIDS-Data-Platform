module.exports = {
  publicPath: getPublicPath(),
  outputDir:'build',
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'UNDP SIDS Data Platform'
    }
  },
  configureWebpack: {
    devServer: {
      proxy: 'http://20.88.191.216/',
      headers: { "Access-Control-Allow-Origin": "*" }
    }
  }
}

function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'production':
        return '/'
    case 'staging':
      return '/SIDS-Data-Platform/'
    default:
      return '/'
  }
}
