const UglifyJsPlugin = require('terser-webpack-plugin');

const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_UAT = process.env.NODE_ENV === 'uat';

module.exports = {
	runtimeCompiler: true,
	publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
	filenameHashing: true,
	configureWebpack: (config) => {
		// enable source-map
		config.devtool = 'source-map';

		config.output.chunkFilename = 'js/[name].[hash].js';

		config.output.filename = 'js/[name].[hash].js';

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
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@images', resolve('src/assets/images'))
			.set('@components', resolve('src/components'))
			.set('@shared', resolve('src/components/shared'))
			.set('@admin', resolve('src/pages/admin'))
			.set('@scss', resolve('src/style'));
	},
	css: {
		extract: {
			// ignoreOrder: IS_PROD,
			ignoreOrder: true,
			chunkFilename: 'css/[name].[hash:8].css',
		},
		sourceMap: true,
		loaderOptions: {
			scss: {
				additionalData: `
					@import "@/style/backStageStyle/_backStageVaribles.scss";
					@import "@/style/backStageStyle/_backStageMixins.scss";
					@import "@/style/backStageStyle/bootstrap/_bsDefault.scss";
				`,
			},
			less: {
				lessOptions: {
					modifyVars: {
						// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
						'primary-color': '#23C4A8',
						'font-size-base': '14px',
						'btn-font-size': '16px',
						'btn-height-base': '36px',

						'table-header-bg': '#F5F8FC',
						'table-header-bg-sm': '#F5F8FC',
						'table-header-color': 'black',
						'table-row-hover-bg': '#edf8ff',
						'table-padding-vertical': '16px',
						'table-padding-horizontal': '6px',

						'item-hover-bg': '#edf8ff',
						'checkbox-color': '#00829B',
						'checkbox-border-width': '1.5px',
						'pagination-item-size-sm': '30px',
						'input-height-sm': '30px',
						'text-color': '#000000',

						'radio-dot-color': '#23C4A8',

						'zindex-modal': '1065',
						'zindex-modal-mask': '1060',
						'zindex-dropdown': '2000',
					},
					javascriptEnabled: true,
				},
			},
		},
	},
	productionSourceMap: !IS_PROD,
	devServer: {
		proxy: {
			'^/api': {
				port: 8100,
				target: 'http://10.241.168.46/iams-api',
				ws: true,
				changOrigin: true,
			},
		},
	},
};
