var path = require('path');

module.exports = {
	entry: './src/app.js',
	output: {
		filename: './dist/al.js'
	},
	resolve: {
		'root': __dirname,
		modulesDirectories : [path.resolve('node_modules/tone/'), path.resolve('node_modules')]
		// 'Tone': [path.resolve('./node_modules/tone/Tone')],
		// 'Tone/source/Player': [path.resolve('./node_modules/tone/Tone/source/Player')]
	}
	// resolve: {
	// 	root: __dirname,
	// 	modulesDirectories : ['node_modules'],
	// }
};