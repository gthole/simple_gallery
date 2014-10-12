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
    initialize: function(options) {
      this.el = options.el;
      this.titleEl = options.titleEl;
      this.data = options.data;

      var self = this;
      $(window).scroll(function() {self.scrollRender();});
    },

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
        this.$("#img-container").append($items);
        var imgld = new ImagesLoaded($items);
        imgld.on("progress", function(imgLoad, image) { // jshint ignore:line
          var $item = $(image.img).parents(".item");
          $item.show();
          self.msnry.appended($item);
        }).on("always", function() {
          // Continue loading images if there's still space to fill
          self.scrollRender();
        });
      }
    },

    scrollRender: function() {
      if ($(window).height() + $(window).scrollTop() ===
          $(document).height()) {
        this.renderPhotos();
      }
    },

    render: function() {
      var gal = new GalleryModel(this.options.data);

      // Set the gallery name
      this.titleEl.html("Gallery / " + gal.get("formattedName"));

      // Render the base template
      var rendered = Mustache.render(galleryTemplate);
      this.el.html(rendered);

      // Bind photos to view and start loading them in
      this.photos = gal.get("photos");
      this.msnry = new Masonry(
        "#img-container",
        {columnWidth: 8, isFitWidth: true}
      );
      this.renderPhotos();
    }
  });
});
