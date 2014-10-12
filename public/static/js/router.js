// Filename: router.js
define([
  "backbone",
  "views/home/HomeView",
  "views/gallery/GalleryView"
], function(Backbone, HomeView, GalleryView) {
  "use strict";

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Gallery route
      ":name": "showGallery",

      // Default
      "*actions": "defaultAction"
    }
  });

  var initialize = function(options) {
    var appRouter = new AppRouter();

    appRouter.on("route:showGallery", function(name) {
      var galleryView = new GalleryView(options);
      galleryView.render(name);
    });

    appRouter.on("route:defaultAction", function() {
      // Default route to the home page
      var homeView = new HomeView(options);
      homeView.render();
    });

    Backbone.history.start({pushState: true});
  };

  return {
    initialize: initialize
  };
});
