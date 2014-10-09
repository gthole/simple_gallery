define([
  "backbone",
  "models/gallery/GalleryModel"
], function(Backbone, GalleryModel) {
  "use strict";

  var GalleryCollection = Backbone.Collection.extend({
    model: GalleryModel,
    url: "/api/v1/gallery/",

    initialize: function() {

    },

    parse: function(response) {
      return response.objects;
    }

  });

  return GalleryCollection;
});
