module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			dist: 'dist/**/*'
		},
		copy: {
			app: {
				expand: true,
				cwd: 'public/',
				src: '**/*',
				dest: 'dist/'
			},
			assets: {
				expand: true,
				cwd: 'bower_components/',
				src: '**/*',
				dest: 'dist/assets/'
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

	grunt.registerTask('default', ['lint', 'build']);
	grunt.registerTask('lint', ['jshint', 'jscs']);
	grunt.registerTask('build', ['clean', 'copy']);
	grunt.registerTask('deploy', ['sftp']);

};
