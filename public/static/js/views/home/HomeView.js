define([
  "backbone",
  "mustache",
  "collections/gallery/GalleryCollection",
  "text!templates/home/homeTemplate.mustache"
], function(Backbone, Mustache, GalleryCollection,
            homeTemplate) {
  "use strict";

  var HomeView = Backbone.View.extend({
    initialize: function(options) {
      this.el = options.el;
      this.data = options.data;
    },

    render: function() {
      var gals = new GalleryCollection();
      gals.reset(this.data.objects);

      var rendered = Mustache.render(
        homeTemplate,
        {"galleries": gals.toJSON()}
      );
      this.el.html(rendered);
    }
  });

  return HomeView;
});
