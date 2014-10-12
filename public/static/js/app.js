// Filename: app.js
define([
  "jquery",
  "router"
], function($, Router) {
  "use strict";

  var initialize = function() {
    // Only the app has full dom access
    var el = $(".page");
    var titleEl = $(".navbar-brand");

    // Load up bootstrapped data from backend
    var dataEl = $(".bootstrapData");
    var data = dataEl.length ? $.parseJSON(dataEl.html()) : {};

    Router.initialize({
      el: el,
      titleEl: titleEl,
      data: data
    });
  };

  return {
    initialize: initialize
  };
});
