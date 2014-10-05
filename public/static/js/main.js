// Filename: main.js
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    mustache: 'libs/mustache/mustache',
    bootstrap: 'libs/bootstrap/bootstrap.min',
    backbone: 'libs/backbone/backbone-min',
    templates: '../templates'
  }

});

require([
  'app',

], function(App){
    App.initialize();
});
