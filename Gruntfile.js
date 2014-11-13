/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  var files =  [
    "Gruntfile.js", "public/static/js/**/*js",
    "!public/static/js/libs/**/*js",
    "!public/static/js/script*.js",
    "!public/static/js/text.js"
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      options: {
        bitwise: true,
        es3: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        plusplus: true,
        quotmark: "double",
        undef: true,
        unused: "strict",
        strict: true,
        trailing: true,
        maxlen: 80,
        globals: {
          define: true,
          document: true,
          require: true,
          window: true
        }
      },
      all: files
    },
    jscs: {
      src: files,
      options: {
        preset: "google",
        validateQuoteMarks: "\"",
        requireCamelCaseOrUpperCaseIdentifiers: "ignoreProperties",
        disallowSpacesInsideObjectBrackets: null,
        disallowMultipleVarDecl: null,
        safeContextKeyword: ["self"]
      }
    },

    "bower-install-simple": {
      options: {
        color: true,
        directory: "public/static/js/libs"
      },
      prod: {
        options: {
          production: true
        }
      }
    },

    requirejs: {
      build: {
        options: {
          baseUrl: "public/static/js",
          name: "libs/almond/almond",
          mainConfigFile: "public/static/js/config.js",
          include: ["main"],
          insertRequire: ["main"],
          out: "public/static/js/script-tmp.js",
          optimize: "none"
        }
      }
    },
    uglify: {
      options: {},
      build: {
        files: {
          "public/static/js/script.js": "public/static/js/script-tmp.js"
        }
      }
    },
    clean: ["public/static/js/script-tmp.js"]
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-bower-install-simple");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("test", ["jshint", "jscs"]);
  grunt.registerTask("bower-install", ["bower-install-simple"]);
  grunt.registerTask("build", ["requirejs:build", "uglify:build", "clean"]);

  // Default task.
  grunt.registerTask("default", ["test"]);
};
