module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			assets: 'public/assets/**/*'
		},
		copy: {
			assets: {
				expand: true,
				cwd: 'bower_components/',
				src: '**/*',
				dest: 'public/assets/'
			}
		},
		jshint: {
			files: ['Gruntfile.js', '{bin,public,tests}/**/*.js', '!public/assets/**/*.js'],
			options: {
				jshintrc: 'build/.jshintrc'
			}
		},
		jscs: {
				src: ['Gruntfile.js', '{bin,public,tests}/**/*.js', '!public/assets/**/*.js'],
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
	grunt.registerTask('assets', ['clean:assets', 'copy:assets']);
	grunt.registerTask('default', ['lint', 'assets']);

};
