define([
  "jquery",
  "mustache",
  "backbone",
  "models/gallery/GalleryModel",
  "masonry",
  "imagesloaded",
  "nprogress",
  "text!templates/gallery/galleryTemplate.mustache",
  "text!templates/gallery/photoTemplate.mustache",
  "text!templates/gallery/modalContent.mustache"
], function($, Mustache, Backbone, GalleryModel, Masonry, ImagesLoaded,
            NProgress, galleryTemplate, photoTemplate,
            modalContentsTemplate) {
  "use strict";

  return Backbone.View.extend({
    initialize: function(options) {
      this.el = options.el;
      this.titleEl = options.titleEl;
      this.data = options.data;
      this.router = options.router;

      var self = this;
      $(window).scroll(function() {self.scrollRender();});
    },

    events: {
      "click .modal": "closeModal",
      "click .photo": "openModal",
      "click .modal-image": "nextImage"
    },

    renderPhotos: function() {
      var self = this,
          items = "",
          i = 0,
          batchCount = window.innerWidth < 400 ? 5 : 10;

      // Generate image html
      while (i < batchCount && this.photos.length) {
        i += 1;
        items += Mustache.render(
          photoTemplate,
          {"gal": this.gal.get("name"), "img": this.photos.pop()}
        );
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

    closeModal: function() {
      $(".modal").hide();
    },

    openModal: function(ev) {
      ev.preventDefault();
      var img = $(ev.currentTarget).data("img");
      this.displayImage(img);
    },

    nextImage: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      // Walk through the images when clicking on the photo.
      var cur = $(ev.currentTarget).data("img");
      var photos = this.gal.get("photos");
      var index = photos.indexOf(cur);
      var nextIndex = index <= 0 ? photos.length - 1 : index - 1;
      this.displayImage(photos[nextIndex]);
    },

    displayImage: function(img) {
      this.router.navigate("/" + this.name + "?i=" + img);
      var $modal = this.$(".modal");
      var $modalContent = this.$(".modal-content");

      // Replace the modal content
      $modalContent.hide();
      var width = $(window).width() < 600 ? 300 : 600;
      var rendered = Mustache.render(
        modalContentsTemplate,
        {"gal": this.gal.get("name"), "img": img, "width": width}
      );
      $modalContent.html(rendered);
      $modal.show();
      var imgld = new ImagesLoaded($modalContent);
      imgld.on("always", function() {
        // Determine the direction to fill on
        var $img = $modalContent.find(".modal-image")[0];
        var imgRatio = $img.height / $img.width;
        var winRatio = $(window).height() / $(window).width();
        var cls = imgRatio > winRatio ? "tall" : "wide";
        $($img).addClass(cls);

        // Show the content
        $modalContent.fadeIn();
      });
    },

    render: function(name) {
      this.name = name;
      this.gal = new GalleryModel(this.data);

      // Render the base template
      var rendered = Mustache.render(galleryTemplate);
      this.el.html(rendered);

      // Bind photos to view and start loading them in
      this.photos = this.gal.get("photos").slice(0);
      this.msnry = new Masonry(
        "#img-container",
        {columnWidth: ".grid-sizer", itemSelector: ".item"}
      );
      this.renderPhotos();

      var hash = window.location.search.slice(3);
      if (hash) {
        this.displayImage(hash);
      }
    }
  });
});
