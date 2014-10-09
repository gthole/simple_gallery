// Filename: router.js
define([
  "jquery",
  "underscore",
  "backbone",
  "views/home/HomeView",
  "views/gallery/GalleryView"
], function($, _, Backbone, HomeView, GalleryView) {
  "use strict";

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Gallery route
      ":name": "showGallery",

      // Default
      "*actions": "defaultAction"
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;

    app_router.on("route:showGallery", function(name){
        var galleryView = new GalleryView();
        galleryView.render(name);
    });

    app_router.on("route:defaultAction", function (actions) {
       // Default route to the home page
        var homeView = new HomeView();
        homeView.render();
    });

    Backbone.history.start({pushState: true});
  };

  return {
    initialize: initialize
  };
});
