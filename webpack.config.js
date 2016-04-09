var path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: './dist/al.js'
	},
	resolve: {
		'root': __dirname,
		modulesDirectories : [path.resolve('node_modules/tone/'), path.resolve('node_modules')]
	}
};