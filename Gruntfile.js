var grunt = require('grunt');

grunt.loadNpmTasks('grunt-svgstore');


grunt.initConfig({
	svgstore: {
		options: {
			prefix : 'shape-', // This will prefix each <g> ID
		},
		default : {
				files: {
					'demo/img/svg-defs.svg': ['demo/img/src/*.svg'],
				}
			}
		}

});

grunt.registerTask('default', 'svgstore')