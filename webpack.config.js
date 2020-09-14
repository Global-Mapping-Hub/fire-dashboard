//webpack.config.js
module.exports = {
	entry: './app/main.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			}, {
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'lib/images/'
					}
				}]
			}, {
				test: /\.(woff|woff2|ttf|otf)$/,
				loader: 'file-loader',
				include: [/fonts/],
				options: {
					name: '[name].[ext]',
					outputPath: 'lib/fonts/'
				}
			},
		],
	},
	externals: {
		jquery: 'jQuery',
		$: 'jquery'
	},
	node: {
		fs: "empty"
	},
	devServer: {
		port: 8080
	}
};