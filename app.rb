# app.rb
require 'sinatra'
require 'sinatra/json'
require 'json'

require_relative 'gallery'

# Find javascript build if present
SCRIPT = Dir.glob("public/static/js/script*.js").map {
  |fn| fn[7..-1]}[-1]


class App < Sinatra::Base
  helpers Sinatra::JSON

  # Core API methods
  get '/api/v1/gallery/' do
    gals = get_galleries()
    json :objects => gals.map {|gal| gal.serialize(limit: true) }
  end

  get '/api/v1/gallery/:gallery_name' do |gallery_name|
    gal = Gallery.new(gallery_name)
    json gal.serialize()
  end

  # Home view with bootstrapped get list
  # TODO: DRY the data calls
  get '/' do
    gals = get_galleries()
    @script = SCRIPT
    @data = {:objects => gals.map {|gal| gal.serialize(limit: true) }}
    erb :index
  end

  # Gallery view / catchall
  get '/:gallery_name' do |gallery_name|
    pass if request.path_info.start_with?("/galleries")
    pass if request.path_info.start_with?("/static")

    gal = Gallery.new(gallery_name).serialize
    @script = SCRIPT
    @data = gal
    @gname = gallery_name
    @fname = gal["formattedName"]
    @host = "#{ request.scheme }://#{ request.host }"
    @image = params[:i] || gal["photos"][-1]
    erb :index
  end
end
