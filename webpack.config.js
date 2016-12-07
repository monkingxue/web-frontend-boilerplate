import webpack from "webpack";
import glob from 'glob';
const config = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: __dirname + '/dist/js/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }],
    preLoaders:[{
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],
  eslint: {
    configFile: './.eslintrc'
  }
};
/**
 * find entries
 */
let files = glob.sync('./src/js/*/index.js');
let newEntries = files.reduce((memo, file) => {
  let name = /.*\/(.*?)\/index\.js/.exec(file)[1];
  memo[name] = entry(name);
  return memo;
}, {});
config.entry = Object.assign({}, config.entry, newEntries);
/**
 * [entry description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function entry(name) {
  return './src/js/' + name + '/index.js';
}
module.exports = config;