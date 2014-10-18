define([
  "jquery",
  "mustache",
  "backbone",
  "models/gallery/GalleryModel",
  "masonry",
  "imagesloaded",
  "nprogress",
  "text!templates/gallery/galleryTemplate.mustache",
  "text!templates/gallery/photoTemplate.mustache"
], function($, Mustache, Backbone, GalleryModel, Masonry, ImagesLoaded,
            NProgress, galleryTemplate, photoTemplate) {
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
          i = 0,
          batchCount = window.innerWidth < 400 ? 5 : 10;

      // Generate image html
      while (i < batchCount && this.photos.length) {
        i += 1;
        items += Mustache.render(photoTemplate, this.photos.pop());
      }

      // If there are any new images, add them to masonry
      // This bit is based on http://codepen.io/desandro/pen/kwsJb
      if (items.length) {
        NProgress.start();
        var $items = $(items);
        $items.hide();
        this.$("#img-container").append($items);
        var imgld = new ImagesLoaded($items);
        imgld.on("progress", function() {
          NProgress.inc(1 / batchCount);
        }).on("always", function() {
          NProgress.done();
          $items.show();
          self.msnry.appended($items);
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
      var gal = new GalleryModel(this.data);

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
