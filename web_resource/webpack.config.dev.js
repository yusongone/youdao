module.exports={
    entry:["./src/entry/index.ts"],
    output:{
        filename:"bundle.js",
        path: __dirname + '/dist',
        publicPath: '/dist', 
        chunkFilename:'[name].min.js',
    },
    resolve:{
        extensions:["",".js",".ts",".jsx"]
    },
    devServer:{
        contentBase:"./"              
    },
    module:{
        loaders:[
            {
                test:/\.tsx$/,
                loader:'ts-loader'
            },
            {
                test:/\.ts$/,
                loader:'ts-loader'
            },
            {
              test: /\.less$/,
              loader: 'style!css!less'
            },
            {
              test: /\.css$/,
              loader: 'style!css'
            }
        ]
    }
}
