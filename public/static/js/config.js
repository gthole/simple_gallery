// Filename: config.js
require.config({
  deps: ["main"],
  paths: {
    jquery: "libs/jquery/jquery-min",
    underscore: "libs/underscore/underscore-min",
    masonry: "libs/masonry/masonry.pkgd.min",
    imagesloaded: "libs/imagesloaded/imagesloaded.pkgd.min",
    mustache: "libs/mustache/mustache",
    backbone: "libs/backbone/backbone-min",
    templates: "../templates"
  },
  shim: {
    "backbone": {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    },
    "masonry": ["jquery"],
    "imagesloaded": ["jquery"]
  }
});
