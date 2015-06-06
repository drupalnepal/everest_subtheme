module.exports = function(grunt) {
  grunt.initConfig({
    config: {
      name: 'everest_subtheme',
      dev_path: 'assets/dev',
      scss_path: 'assets/src/scss/',
      css_path_dev: 'assets/dev/css/',
      css_path_dist: 'css/',
      js_path: 'assets/src/js/',
      js_path_dev: 'assets/dev/js/',
      js_path_dist: 'js/',
      images_path: 'assets/src/images/',
      images_path_dev: 'assets/dev/images/',
      images_path_dist: 'images/',
      fonts_path: 'assets/src/fonts/',
      fonts_path_dev: 'assets/dev/fonts/',
      fonts_path_dist: 'fonts/',
    },

    clean: {
      dev: ['<%= config.dev_path %>'],
      dist: ['<%= config.css_path_dist %>', '<%= config.js_path_dist %>', '<%= config.images_path_dist %>', '<%= config.fonts_path_dist %>'],
    },

    jshint: {
      options: {
        jshintrc: true,
      },
      files: ['<%= config.js_path %>**/*.js', '!<%= config.js_path %>libraries/**/*.js'],
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          banner: "/* <%= config.name %> */\n",
        },
        files: [{
          expand: true,
          cwd: '<%= config.js_path %>',
          src: ['**/*.js', '!libraries/**/*.js'],
          dest: '<%= config.js_path_dev %>',
          rename: function(dest, src) {
            var folder = src.substring(0, src.lastIndexOf('/'));
            var filename = src.substring(src.lastIndexOf('/'), src.length);
            filename = filename.substring(0, filename.lastIndexOf('.'));
            return dest + folder + filename + '.js';
          },
        }],
      },
      dist: {
        options: {
          mangle: true,
          compress: true,
          banner: "/* <%= config.name %> */\n",
        },
        files: [{
          expand: true,
          cwd: '<%= config.js_path %>',
          src: ['**/*.js', '!libraries/**/*.js'],
          dest: '<%= config.js_path_dist %>',
          rename: function(dest, src) {
            var folder = src.substring(0, src.lastIndexOf('/'));
            var filename = src.substring(src.lastIndexOf('/'), src.length);
            filename = filename.substring(0, filename.lastIndexOf('.'));
            return dest + folder + filename + '.min.js';
          },
        }],
      },
    },

    copy: {
      dev: {
        files: [
          {expand: true, cwd: '<%= config.fonts_path %>', src: ['**'], dest: '<%= config.fonts_path_dev %>'},
          {expand: true, cwd: '<%= config.js_path %>', src: ['libraries/**'], dest: '<%= config.js_path_dev %>'},
        ],
      },
      dist: {
        files: [
          {expand: true, cwd: '<%= config.fonts_path %>', src: ['**'], dest: '<%= config.fonts_path_dist %>'},
          {expand: true, cwd: '<%= config.js_path %>', src: ['libraries/**'], dest: '<%= config.js_path_dist %>'},
        ],
      },
    },

    compass: {
      options: {
        config: 'config.rb',
        force: true,
      },
      dev: {
        options: {
          environment: 'development',
        },
      },
      dist: {
        options: {
          environment: 'production',
        },
      },
    },

    imagemin: {
      options: {
        optimizationLevel: 3,
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.images_path %>',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= config.images_path_dev %>',
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.images_path %>',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= config.images_path_dist %>',
        }],
      },
    },

    watch: {
      js: {
        files: ['<%= config.js_path %>/**/*.js', '!<%= config.js_path %>/libraries/**'],
        tasks: ['jshint'],
      },
      css: {
        files: ['<%= config.scss_path %>/**/*.scss'],
        tasks: ['compass:dev'],
      },
    },

    shell: {
      dev: {
        command: [
          'drush cache-clear theme-registry',
          'drush cache-clear css-js',
        ].join('&&'),
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['clean:dev', 'jshint', 'uglify:dev', 'copy:dev', 'compass:dev', 'imagemin:dev', 'shell:dev', 'watch']);
  grunt.registerTask('dist', ['clean:dist', 'jshint', 'uglify:dist', 'copy:dist', 'imagemin:dist', 'compass:dist']);
};
