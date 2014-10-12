Simple Gallery
==============

Stupid simple gallery built on Sinatra/Backbone

Runs two processes - a web server and a directory watcher to generate thumbnails.

To use, install `rvm` and `node`

```bash
$ cd simple_gallery
$ bundle install
$ mkdir -p public/galleries
$ foreman start
```

Then copy folders of images into `public/galleries` and go to [http://localhost:4567/](http://localhost:4567)
