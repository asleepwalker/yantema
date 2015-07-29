module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			dist: 'dist/**/*'
		},
		copy: {
			app: {
				src: ['{bin,models,routes,views}/**/*', 'app.js', 'package.json'],
				dest: 'dist/'
			},
			assets: {
				expand: true,
				cwd: 'bower_components/',
				src: '**/*',
				dest: 'dist/public/assets/'
			},
			public: {
				src: 'public/**/*',
				dest: 'dist/'
			}
		},
		jshint: {
			files: ['**/*.js', '!{bower_components,node_modules,dist}/**/*.js'],
			options: {
				jshintrc: 'build/.jshintrc'
			}
		},
		jscs: {
				src: ['**/*.js', '!{bower_components,node_modules,dist}/**/*.js'],
				options: {
					config: 'build/.jscsrc'
				}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');

	grunt.registerTask('lint', ['jshint', 'jscs']);
	grunt.registerTask('assets', ['copy:assets']);
	grunt.registerTask('public', ['copy:public', 'assets']);//, 'sprite', 'sass', 'uglify', 'concat']);
	grunt.registerTask('dist', ['public', 'copy:app']);
	grunt.registerTask('build', ['lint', 'dist']);
	grunt.registerTask('test', ['mocha']);
	grunt.registerTask('deploy', ['sftp']);
	grunt.registerTask('default', ['build', 'test']);

};
