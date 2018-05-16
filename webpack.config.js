const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

// const Visualizer = require('webpack-visualizer-plugin'); // remove it in production environment.
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // remove it in production environment.
// const otherPlugins = process.argv[1].indexOf('webpack-dev-server') >= 0 ? [] : [
//   new Visualizer(), // remove it in production environment.
//   new BundleAnalyzerPlugin({
//     defaultSizes: 'parsed',
//     // generateStatsFile: true,
//     statsOptions: { source: false }
//   }), // remove it in production environment.
// ];

const postcssOpts = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
        }),
        // pxtorem({ rootValue: 75, propBlackList: [] })
    ]
};

module.exports = {
    devtool: 'source-map', // or 'inline-source-map'
    devServer: {
        disableHostCheck: true
    },
    
    entry: {"index": path.resolve(__dirname, 'src/index')},
    
    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: path.join(__dirname, '/dist/'),
        publicPath: '/dist/'
        // path: path.join(__dirname, '../画客网H5打包/dist/'),
        // publicPath: './dist/'
    },
    
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), path.join(__dirname, 'src')],
        extensions: ['.web.js', '.jsx', '.js', '.json']
    },
    
    module: {
        rules: [
            {
                test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader',
                options: {
                    plugins: [
                        'external-helpers', // why not work?
                        ["transform-runtime", {polyfill: false}],
                        ["import", [{"style": "css", "libraryName": "antd-mobile"}]]
                    ],
                    presets: ['es2015', 'stage-0', 'react']
                    // presets: [['es2015', { modules: false }], 'stage-0', 'react'] // tree-shaking
                }
            },
            { test: /\.(jpg|png)$/, loader: "url-loader?limit=8192&name=images/[name].[ext]" },
            // {test: /\.(jpg|png)$/, loader: "url-loader?limit=8192&name=images/[hash:8].[name].[ext]"},
            // {test:/\.(eot|ttf|woff|woff2|svg)$/,loader:'file?name=fonts/[name].[ext]'},
            { test: /\.(gif|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=20000&name=/fonts/[name].[ext]'},
            // 注意：如下不使用 ExtractTextPlugin 的写法，不能单独 build 出 css 文件
            // { test: /\.less$/i, loaders: ['style-loader', 'css-loader', 'less-loader'] },
            // { test: /\.css$/i, loaders: ['style-loader', 'css-loader'] },
            // {
            //   test: /\.less$/i, use: ExtractTextPlugin.extract({
            //     fallback: 'style-loader',
            //     use: [
            //       'css-loader', { loader: 'postcss-loader', options: postcssOpts }, 'less-loader'
            //     ]
            //   })
            // },
            {
                test: /\.css$/i, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {loader: 'postcss-loader', options: postcssOpts}
                    ]
                })
            },
            {
                test: /\.scss$/i, use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {loader: 'postcss-loader', options: postcssOpts},
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    // postcss: function() {
    //     return [pxtorem({remUnit: 75})];
    // },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new webpack.ProvidePlugin({
            runPromise: ['../components/promise.jsx', 'default'],
            validate: ['../components/validate.js', 'default'],
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.optimize.CommonsChunkPlugin({
            // minChunks: 2,
            name: 'shared',
            filename: 'shared.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({filename: '[name].css', allChunks: true})
        // ...otherPlugins
    ],
    devServer:{
        historyApiFallback:true,
        inline:true,//注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
        port:4994, //端口你可以自定义
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    }
}
