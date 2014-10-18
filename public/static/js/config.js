// Filename: config.js
require.config({
  deps: ["main"],
  paths: {
    jquery: "libs/jquery/dist/jquery.min",
    underscore: "libs/underscore/underscore-min",
    masonry: "libs/masonry/dist/masonry.pkgd.min",
    imagesloaded: "libs/imagesloaded/imagesloaded.pkgd.min",
    nprogress: "libs/nprogress/nprogress",
    mustache: "libs/mustache/mustache",
    backbone: "libs/backbone/backbone",
    templates: "../templates"
  },
  shim: {
    backbone: {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    },
    masonry: ["jquery"],
    imagesloaded: ["jquery"]
  }
});
