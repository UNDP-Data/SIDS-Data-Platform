module.exports = {
  publicPath: getPublicPath(),
  outputDir:'build',
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'UNDP SIDS Data Platform',
      description: 'A digital tool for analyzing the UNDP SIDS Offer Portfolio across the SDGs, SAMOA Pathway priorities, and six UNDP Signature Solutions.'
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
        return '/sids/app/'
    case 'staging':
      return '/SIDSDataPlatform/'
    default:
      return '/'
  }
}
