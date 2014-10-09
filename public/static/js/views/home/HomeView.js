define([
  "jquery",
  "underscore",
  "backbone",
  "mustache",
  "collections/gallery/GalleryCollection",
  "text!/static/templates/home/homeTemplate.mustache"
], function($, _, Backbone, Mustache, GalleryCollection, homeTemplate){
  "use strict";

  var HomeView = Backbone.View.extend({
    el: $(".page"),

    render: function(){
      var self = this;
      this.gals = new GalleryCollection;
      this.gals.fetch({
        success: function() {
          var rendered = Mustache.render(
            homeTemplate,
            {"galleries": self.gals.toJSON()}
          );
          $(".page").html(rendered);
        }
      });
    }

  });

  return HomeView;

});
