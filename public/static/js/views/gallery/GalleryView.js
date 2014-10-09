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
      // var self = this;
      // $(window).scroll(function() {self.renderPhotos();});
    },

    el: $(".page"),

    // TODO: Reinstate on-demand loading
    renderPhotos: function() {
      while (this.atBottomOfPage() && this.photos.length) {
        this.addPhoto();
      }
    },

    addPhoto: function() {
      if (this.photos.length) {
        var rendered = Mustache.render(
          photoTemplate, this.photos.pop());
        $("#img-container").append(rendered);
      }
    },

    atBottomOfPage: function() {
      return ($(window).height() + $(window).scrollTop() ===
              $(document).height());
    },

    render: function(name) {
      var gal = new GalleryModel({name: name});
      gal.fetch({
        success: function() {
          $(".navbar-brand").html("Gallery / " + gal.get("formattedName"));
          var rendered = Mustache.render(
            galleryTemplate,
            gal.toJSON()
          );
          $(".page").html(rendered);
          var container = $("#img-container");
          ImagesLoaded(container, function() {
            new Masonry("#img-container", {isFitWidth: true});
          });
        }
      });
    }
  });
});
