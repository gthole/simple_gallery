define([
  "jquery",
  "mustache",
  "backbone",
  "models/gallery/GalleryModel",
  "masonry",
  "imagesloaded",
  "text!templates/gallery/galleryTemplate.mustache",
  "text!templates/gallery/photoTemplate.mustache"
], function($, Mustache, Backbone, GalleryModel, Masonry, ImagesLoaded,
            galleryTemplate, photoTemplate) {
  "use strict";

  return Backbone.View.extend({
    initialize: function() {
      var self = this;
      $(window).scroll(function() {self.scrollRender();});
    },

    el: $(".page"),

    renderPhotos: function() {
      var self = this,
          items = "",
          i = 0;

      // Generate image html
      while (i < 10 && this.photos.length) {
        i += 1;
        items += Mustache.render(photoTemplate, this.photos.pop());
      }

      // If there are any new images, add them to masonry
      // This bit is based on http://codepen.io/desandro/pen/kwsJb
      if (items.length) {
        var $items = $(items);
        $items.hide();
        $("#img-container").append($items);
        var imgld = new ImagesLoaded($items);
        imgld.on("progress", function(imgLoad, image) { // jshint ignore:line
          var $item = $(image.img).parents(".item");
          $item.show();
          self.msnry.appended($item);
        });
      }
    },

    scrollRender: function() {
      if ($(window).height() + $(window).scrollTop() ===
          $(document).height()) {
        this.renderPhotos();
      }
    },

    render: function(name) {
      var self = this;
      var gal = new GalleryModel({name: name});
      gal.fetch({
        success: function() {
          $(".navbar-brand").html("Gallery / " + gal.get("formattedName"));
          var rendered = Mustache.render(galleryTemplate);
          $(".page").html(rendered);
          self.photos = gal.get("photos");

          self.msnry = new Masonry(
            "#img-container",
            {
              columnWidth: 10, isFitWidth: true
            }
          );
          self.renderPhotos();
        }
      });
    }
  });
});
