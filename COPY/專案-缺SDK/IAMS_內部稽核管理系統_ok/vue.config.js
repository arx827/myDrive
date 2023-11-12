const UglifyJsPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);

module.exports = {
	publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
	configureWebpack: (config) => {
		// enable source-map
		// config.devtool = !IS_PROD ? 'source-map' : false;

		config.output.chunkFilename = 'js/[name].[hash:8].js';

		config.output.filename = 'js/[name].[hash:8].js';

		// enable uglify
		if (IS_PROD || IS_UAT) {
			const plugins = [];

			// 調整包版記憶體
			const existingForkTsChecker = config.plugins.filter(
				(p) => p instanceof ForkTsCheckerWebpackPlugin,
			)[0];
			config.plugins = config.plugins.filter(
				(p) => !(p instanceof ForkTsCheckerWebpackPlugin),
			);
			const forkTsCheckerOptions = existingForkTsChecker.options;
			forkTsCheckerOptions.workers = 4;
			forkTsCheckerOptions.memoryLimit = 8192;

			plugins.push(
				new UglifyJsPlugin({
					terserOptions: {
						warnings: true,
						output: {
							comments: false,			// 是否顯示註釋
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
			config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));
			config.plugins = [...config.plugins, ...plugins];
		}
		config.optimization = {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					antDesignVue: {
						name: 'chunk-ant-design-vue',
						test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
						chunks: 'initial',
						priority: 3,
						reuseExistingChunk: true,
						enforce: true,
					},
					bootstrap: {
						name: 'bootstrap',
						test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
						priority: 10,
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
			ignoreOrder: true,
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[name].[hash:8].css',
		},
		sourceMap: !IS_PROD,
		loaderOptions: {
			scss: {
				additionalData: `
					@import "@/style/varibles.scss";
					@import "@/style/mixin.scss";
					@import "@/style/backStageStyle/_backStageVaribles.scss";
					@import "@/style/backStageStyle/_backStageMixins.scss";
					@import "@/style/backStageStyle/bootstrap/_bsDefault.scss";
				`,
			},
			less: {
				lessOptions: {
					modifyVars: {
						// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
						// 'border-radius-base': '4px',
						'primary-color': '#4CAAF5',
						'font-size-base': '14px',
						// 'btn-border-radius-base': '50vh',
						'btn-font-size': '16px',
						'btn-height-base': '36px',
						'input-height-base': '36px',
						'table-header-bg': '#23C4A8',
						'table-header-bg-sm': '#23C4A8',
						'table-header-color': 'white',
						// 'table-header-sort-bg': '#12b4b4',
						'table-row-hover-bg': '#edf8ff',
						'table-padding-vertical': '16px',
						'table-padding-horizontal': '6px',
						'item-hover-bg': '#edf8ff',
						'checkbox-size': '27px',
						'checkbox-color': '#00829B',
						'checkbox-border-width': '1.5px',
						'pagination-item-size-sm': '30px',
						'input-height-sm': '30px',
						'text-color': '#000000',
						'zindex-modal': '1065',
						'zindex-modal-mask': '1060',
						'zindex-dropdown': '2000',
						// 'table-header-bg': '#7CACD3',
						// 'table-header-color': '#FFFFFF',
						// 'table-row-hover-bg': '#F2F8FF',
						// 'table-border-radius-base': '0px',
						// 'pagination-item-bg-active': '#4CAAF5',
						// 'form-item-margin-bottom': '15px',
						// For compacted styling:
						// 'padding-lg': '24px',
						// 'padding-md': '16px',
						// 'padding-sm': '12px',
						// 'padding-xs': '8px',
						// 'table-padding-vertical': '4px',
						// 'border-color-base': '#d9d9d9',
						// 'border-width-base': '1px',
					},
					javascriptEnabled: true,
				},
			},
		},
	},
	crossorigin: '',
	// runtimeCompiler: true,
	productionSourceMap: !IS_PROD,
	devServer: {
		proxy: {
			'^/api': {
				port: 8100,
				target: 'http://sdtwlvx00404:8083/iams-api',
				ws: true,
				changOrigin: true,
			},
		},
	},
};
