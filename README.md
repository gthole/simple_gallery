Simple Gallery
==============

Stupid simple gallery built on Sinatra/Backbone, with Masonry/ImagesLoaded for tiling.

Runs two processes - a web server and a directory watcher to generate thumbnails.

To use, install `rvm` and `node`

```bash
$ cd simple_gallery

# Install ruby dependencies
$ bundle install

# Install node modules
$ npm install

# Install javascript app dependencies
$ node_modules/grunt-cli/bin/grunt bower-install

# Create a directory to watch and start the app
$ mkdir -p public/galleries
$ foreman start
```

Then copy folders of images into `public/galleries` and go to [http://localhost:4567/](http://localhost:4567)

Run the grunt task to create the javascript build:

```bash
$ npm install
$ node_modules/grunt-cli/bin/grunt build
```

The sinatra app will automatically pick up the compiled script and use that over the individual files.

