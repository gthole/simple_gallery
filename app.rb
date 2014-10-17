# app.rb
require 'sinatra'
require 'sinatra/json'
require 'json'

require_relative 'gallery'


class App < Sinatra::Base
  helpers Sinatra::JSON

  attr_accessor :script

  # Find javascript build if present
  @script = Dir.glob("public/static/js/script*.js").map {
    |fn| fn[7..-1]}[0]

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
    @data = {:objects => gals.map {|gal| gal.serialize(limit: true) }}
    erb :index
  end

  # Gallery view / catchall
  get '/:gallery_name' do |gallery_name|
    pass if request.path_info.start_with?("/galleries")
    pass if request.path_info.start_with?("/static")
    pass if request.path_info.start_with?("/thumbs")

    gal = Gallery.new(gallery_name).serialize
    @data = gal
    @name = gal["formattedName"]
    erb :index
  end
end
