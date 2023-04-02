const path = require('path')
const pkg = require('./package')

const isDeploy = process.env.IS_DEPLOY === '1'
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || pkg.config.port || 3000
const basename = pkg.config.vd
const raw = v => v


module.exports = {
    layout: 'Layout',
    routes: 'routes',
    port: port,
    basename: [basename],
    title: 'PdfAsk',
    description: 'PdfAsk',
    keywords: 'PdfAsk',
    cookieParser: {
        // 使用raw的方式解析cookie
        decode: raw,
    },
    // 预填充的 context 上下文，会出现在所有 controller.context 里，应该是静态数据
    context: {
        isDeploy,
        isProd,
    },
    // 是否开启 webpack 可视化分析
    bundleAnalyzer: false,
    // 是否使用 fork-ts-checker-webpack-plugin 进行类型检查
    useTypeCheck: true,
    // 需要添加的 webpack plugin 配置
    webpackPlugins: [],
    // 需要自定义的 webpack 其他配置
    webpack: function (webpackConfig, isServer) {
        if (webpackConfig && webpackConfig.module && webpackConfig.module.rules) {
            // console.log(`webpackConfig.module.rules`, webpackConfig.module.rules)
            const matchedIndex = webpackConfig.module.rules.findIndex(
                rule =>
                    rule &&
                    rule.test &&
                    String(rule.test) &&
                    String(rule.test).indexOf('.css') > -1
            )

            const cssMatchUse = [
                {
                    loader: 'style-loader',
                }, 
                {
                    loader: 'css-loader', // translates CSS into CommonJS
              }
            ]

            if (matchedIndex !== -1) {
                webpackConfig.module.rules[matchedIndex].use = cssMatchUse
            }else{
                webpackConfig.module.rules.push({ test: /\.css$/, use: cssMatchUse })
            }
        }
        webpackConfig.module.rules.push(
            {
                test: /pdf\.js$/,
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-private-property-in-object']
                }
            }
        )
        return webpackConfig
    },
    // 打包文件名称格式
    productionOutput: {
        filename: 'js/[name]-[hash:6].js',
        chunkFilename: 'js/[name]-[hash:6].js',
    }
}
