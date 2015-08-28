var path = require('path');
var webpack = require('webpack');
var config = {
    context: path.join(__dirname, 'src'), // исходная директория
    entry: './index', // файл для сборки, если несколько - указываем hash (entry name => filename)
    output: {
        path: path.join(__dirname, 'assets') // выходная директория
    }
};
var compiler = webpack(config);
compiler.run(function (err, stats) {
    console.log(stats.toJson()); // по завершению, выводим всю статистику
});

 plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        ],
        [
        DefinePlugin({
            'NODE_ENV': JSON.stringify('production')
        }),
        ],
        [
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            includes: /.*/,
            excludes: /.*\.less$/
        }),
        ];


 module: [
        {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },

        ],
    }
    ];

plugins: [
    new ExtractTextPlugin('style.css'),
];

module: [
        {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.hbs$/, loader: 'handlebars-loader'},
            {
                test: /\.(eot|woff|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            },
        
        ],
        },

        resolve: [
            {
            extensions: ['', '.js', '.jsx'],
            },

            module: 
                loaders: [
                    {test: /\.jsx$/, loader: 'jsx-loader'},
                
                ],
        
        ];

        ];


