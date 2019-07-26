const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const paths = require('./paths');
const templates = require('./templates').templates;

const PROJECT_VARS = require('./variables');

const ExtractCSS = new ExtractTextPlugin(`arquivos/${PROJECT_VARS.PROJECT_ID}.min.css`);

module.exports = merge(common, {
  entry: {
    [PROJECT_VARS.PROJECT_ID]: ['./config/polyfills.js', paths.indexJs]
  },
  plugins: [
    new CleanWebpackPlugin([paths.dist], {root: paths.root}),
    ...templates,
    new UglifyJSPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    ExtractCSS,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      {
            test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: require.resolve('style-loader'),
                  use: [
                    {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        ident: 'postcss',
                        plugins: () => [
                          require('postcss-flexbugs-fixes'),
                          require('css-mqpacker')({ sort: true }),
                          require('autoprefixer')({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 9'
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      },
                    },
                    {
                      loader: require.resolve('sass-loader'),
                      options: {
                        outputStyle: 'compressed'
                      }
                    }
                  ],
                }
              )
            )
          }
    ]
  }
});
