module.exports = function(grunt) {

  grunt.initConfig({

    // -------------------------------------------------------------------------------------
    // `grunt resize` : This task resizes all new images placed in `blog/assets/development/images/`
    // and places them into `blog/assets/production/images/`.
    //
    // Relies on 'grunt-responsive-images': https://github.com/andismith/grunt-responsive-images
    responsive_images: {
      convertLarge: {
        options: {
          sizes: [{
            width: 1300
          }]
        },
        files: [{
          expand: true,
          src: ['**.*'],
          cwd: 'assets/original_images',
          custom_dest: 'assets/images'
        }]
      },
    },

    // -------------------------------------------------------------------------------------
    // This task compiles the main Sass file, `assets/stylesheets/main.scss`,
    // into `assets/stylesheets/main.css`
    //
    // Relies on 'grunt-contrib-sass': https://github.com/gruntjs/grunt-contrib-sass
    //
    // To run this task manually: `grunt sass`
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'assets/stylesheets/main.css': 'assets/stylesheets/main.scss'
        }
      }
    },

    // -------------------------------------------------------------------------------------
    // This task watches the main Sass file, `assets/stylesheets/main.scss`,
    // and runs the 'sass' task (above).
    //
    // Relies on 'grunt-contrib-watch': https://github.com/gruntjs/grunt-contrib-watch
    //
    // To run this task manually: `grunt watch`
    watch: {
      css: {
        files: "**/*.scss",
        tasks: ['sass']
      }
    },

  });

  // -------------------------------------------------------------------------------------

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // -------------------------------------------------------------------------------------
  grunt.registerTask('resize', ['responsive_images']);

  // 'default' resizes and moves images into /images folder and compiles Sass to CSS.
  // To run manually, run `grunt default`
  grunt.registerTask('default', ["resize", 'sass']);
};
