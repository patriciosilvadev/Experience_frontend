module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: () => {
					let _responsiveness = '@import "@/styles/_responsiveness.scss"';
					let _colors = '@import "@/styles/__colors.scss"';
					let _theme = `$COLOR: ${process.env.APP_THEME}`
					return _responsiveness + '\n' + _colors + '\n' + _theme;
				}
			}
		}
	},
	devServer: {
		disableHostCheck: true,
		proxy: 'http://192.168.1.41:9000'
	}
}