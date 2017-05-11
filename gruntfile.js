module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			html: {
				files: ['app/views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'app/**/*.js'],
				// tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			uglify: {
			 	files: ['public/**/*.js'],
			 	// tasks: ['jshint'],
			 	options: {
			 		livereload: true
			 	}
			},
			styles: {
			 	files: ['public/**/*.less'],
			 	tasks: ['less'],
			 	options: {
			 		nospawn: true
			 	}
			}
		},

		jshint: {
		 	options: {
		 		jshintrc: '.jshintrc',
		 		ignores: ['public/libs/**/*.js']
		 	},
		 	all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		less: {
		 	development: {
		 		options: {
		 			compress: true,
		 			yuicompress: true,
		 			optimization: 2
		 		},
		 		files: {
		 			'public/css/addEdit.css': 'public/less/addEdit.less',
		 			'public/css/admin.css': 'public/less/admin.less',
		 			'public/css/detail.css': 'public/less/detail.less',
		 			'public/css/error.css': 'public/less/error.less',
		 			'public/css/index.css': 'public/less/index.less',
		 			'public/css/list.css': 'public/less/list.less',
		 			'public/css/search.css': 'public/less/search.less',
		 			'public/css/register.css': 'public/less/register.less',
		 		}
		 	},
		 	build: {
				options: {
		 			compress: true,
		 			yuicompress: true,
		 			optimization: 2
		 		},
		 		files: {
		 			'build/css/addEdit.css': 'public/less/addEdit.less',
		 			'build/css/admin.css': 'public/less/admin.less',
		 			'build/css/detail.css': 'public/less/detail.less',
		 			'build/css/error.css': 'public/less/error.less',
		 			'build/css/index.css': 'public/less/index.less',
		 			'build/css/list.css': 'public/less/list.less',
		 			'build/css/search.css': 'public/less/search.less',
		 			'build/css/register.css': 'public/less/register.less',
		 		}
		 	}
		},

		uglify: {
		 	development: {
		 		files: {
		 			'build/js/addEdit.js':  'public/js/addEdit.js',
		 			'build/js/admin.js':  'public/js/admin.js',
		 			'build/js/detail.js':  'public/js/detail.js',
		 			'build/js/category.js':  'public/js/category.js',
		 			'build/js/index.js':  'public/js/index.js',
		 			'build/js/list.js':  'public/js/list.js',
		 			'build/js/page.js':  'public/js/page.js',
		 			'build/js/register.js':  'public/js/register.js',
		 		}
		 	}
		 },

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
		 	options: {
		 		reporter: 'spec'
		 	},
		 	src: ['test/**/*.js']
		},

		concurrent: {
			tasks: ['nodemon', 'watch', 'less:development'],//'jshint'
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')
	grunt.loadNpmTasks('grunt-mocha-test')
	grunt.loadNpmTasks('grunt-contrib-less')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-jshint')

	grunt.option('force', true)

	grunt.registerTask('default', ['concurrent'])
	grunt.registerTask('build', ['less:build','uglify'])

	grunt.registerTask('test', ['mochaTest'])
}