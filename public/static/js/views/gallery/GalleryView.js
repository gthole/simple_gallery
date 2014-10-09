define([
  "jquery",
  "masonry",
  "imagesloaded",
  "backbone",
  "mustache",
  "models/gallery/GalleryModel",
  "text!/static/templates/gallery/galleryTemplate.mustache",
  "text!/static/templates/gallery/photoTemplate.mustache"
], function($, Masonry, ImagesLoaded, Backbone, Mustache,
            GalleryModel, galleryTemplate, photoTemplate){
  "use strict";

  return Backbone.View.extend({
    initialize: function() {
      var self = this;
      // $(window).scroll(function() {self.renderPhotos();});
    },

    el: $(".page"),
    
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
      return $(window).height() + $(window).scrollTop() == $(document).height();
    },

    render: function(name) {
      var self = this;
      var gal = new GalleryModel({name: name});
      gal.fetch({
        success: function() {
          var rendered = Mustache.render(
            galleryTemplate,
            gal.toJSON()
          );
          $(".page").html(rendered);
          var container = $("#img-container");
          container.imagesLoaded( function() {
            container.masonry({isFitWidth: true});
          });
       }
      })
    }
  });
});
