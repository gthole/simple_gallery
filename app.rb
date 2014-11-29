# app.rb
require 'sinatra'
require 'sinatra/json'
require 'json'

require_relative 'gallery'

# Get git version for cache-busting
$VERSION = nil
if Dir.glob("public/static/js/script.js").length > 0
  $VERSION = `git rev-parse HEAD`
end


class App < Sinatra::Base
  helpers Sinatra::JSON

  # Core API methods
  get '/api/v1/gallery/' do
    gals = get_galleries()
    json :objects => gals.map {|gal| gal.serialize }
  end

  get '/api/v1/gallery/:gallery_name' do |gallery_name|
    gal = Gallery.new(gallery_name)
    json gal.serialize
  end

  # Home view with bootstrapped get list
  # TODO: DRY the data calls
  get '/' do
    gals = get_galleries()
    @version = $VERSION
    @data = {:objects => gals.map {|gal| gal.serialize }}
    erb :index
  end

  # Gallery view / catchall
  get '/:gallery_name' do |gallery_name|
    pass if request.path_info.start_with?("/galleries")
    pass if request.path_info.start_with?("/static")

    gal = Gallery.new(gallery_name).serialize
    @version = $VERSION
    @data = gal
    @gname = gallery_name
    @fname = gal["name"]
    @host = "#{ request.scheme }://#{ request.host }"
    @image = params[:i] || gal["photos"][-1]
    erb :index
  end
end
