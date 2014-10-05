define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var GalleryModel = Backbone.Model.extend({
    url: function() {
      return "/api/v1/gallery/" + this.get("name");
    }
  });

  return GalleryModel;

});
