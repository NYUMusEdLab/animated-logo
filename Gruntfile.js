var grunt = require('grunt');

grunt.loadNpmTasks('grunt-svgstore');



/**
 *  example usage: 
 *  
 *  grunt --src=my/source/folder --dst=my/destination/folder
 */
var src = grunt.option( 'src' ) ? grunt.option( 'src' ) + '/*.svg' : 'demo/img/src/*.svg';
var dst = grunt.option( 'dst' ) ? grunt.option( 'dst' ) + '/svg-defs.svg' : 'demo/img/svg-defs.svg';

var filePath = {};
filePath[dst] = src;
console.log(filePath);

grunt.initConfig({
	svgstore: {
		options: {
			prefix : 'shape-', // This will prefix each <g> ID
		},
		default : {
				files: filePath
			}
		}

});

grunt.registerTask('default', 'svgstore')