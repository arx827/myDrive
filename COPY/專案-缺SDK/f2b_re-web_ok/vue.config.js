const UglifyJsPlugin = require('terser-webpack-plugin');

const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

module.exports = {
	runtimeCompiler: true,
	publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@images', resolve('src/assets/images'))
			.set('@compononts', resolve('src/components/shared'))
			.set('@scss', resolve('src/style/scss'))
			.set('@less', resolve('src/style/less'));
	},
	configureWebpack: (config) => {
		// enable source-map
		config.devtool = 'source-map';

		// enable uglify
		if (IS_PROD || IS_UAT) {
			const plugins = [];
			plugins.push(
				new UglifyJsPlugin({
					terserOptions: {
						warnings: true,
						output: {
							comments: false,
							beautify: false,
						},
						compress: {
							drop_console: true,
							drop_debugger: true,
						},
					},
					parallel: true,
				}),
			);
			config.plugins = [...config.plugins, ...plugins];
		}
		config.optimization = {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					bootstrap: {
						name: 'bootstrap',
						test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
						priority: 10,
					},
					antDesignVue: {
						name: 'chunk-ant-design-vue',
						test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
						chunks: 'initial',
						priority: 3,
						reuseExistingChunk: true,
						enforce: true,
					},
				},
			},
		};
	},
	css: {
		extract: {
			chunkFilename: 'css/[name].[hash:8].css',
		},
		sourceMap: IS_PROD,
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {
						// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
            hack: 'true; @import "~@less/import/antdStyle.less";',
          },
					javascriptEnabled: true,
				},
			},
			scss: {
				additionalData: `
          @import "~@scss/import/_varibles.scss";
        `,
			},
		},
	},
	productionSourceMap: false,
	devServer: {
		proxy: {
			'^/api': {
				port: process.env.VUE_APP_API_BASE_URL_PORT,
				target: process.env.VUE_APP_AXIOS_API_BASE_URL,
				ws: true,
				changOrigin: true,
			},
		},
	},
};
