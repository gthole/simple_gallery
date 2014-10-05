define([
  'jquery',
  'underscore',
  'backbone',
  'mustache',
  'models/gallery/GalleryModel',
  'text!/static/templates/gallery/galleryTemplate.mustache',
  'text!/static/templates/gallery/photoTemplate.mustache'
], function($, _, Backbone, Mustache, GalleryModel, galleryTemplate,
            photoTemplate){

  return Backbone.View.extend({
    initialize: function() {
      var self = this;
      $(window).scroll(function() {self.renderPhotos();});
    },

    el: $("#page"),
    
    renderPhotos: function() { 
      while (this.atBottomOfPage() && this.photos.length) {
        this.addPhoto(".firstCol");
        this.addPhoto(".secondCol");
        this.addPhoto(".thirdCol");
      } 
    },

    addPhoto: function(selector) {
      if (this.photos.length) {
        var rendered = Mustache.render(photoTemplate, this.photos.pop());
        $(selector).append(rendered);
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
          var rendered = Mustache.render(galleryTemplate, gal.toJSON());
          $("#page").html(rendered);
          self.photos = gal.toJSON().photos;
          self.renderPhotos();
        }
      })
    }
  });
});
