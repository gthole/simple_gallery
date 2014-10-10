# app.rb
require 'sinatra'
require "sinatra/json"

require_relative 'gallery'


class App < Sinatra::Base
  helpers Sinatra::JSON

  attr_accessor :script

  # Core API methods
  get '/api/v1/gallery/' do
    gals = get_galleries()
    json :objects => gals.map {|gal| gal.serialize }
  end

  get '/api/v1/gallery/:gallery_name' do |gallery_name|
    gal = Gallery.new(gallery_name)
    json gal.serialize()
  end

  # Everything else should trigger the JS app
  get // do
    pass if request.path_info.start_with?("/galleries")
    pass if request.path_info.start_with?("/static")
    pass if request.path_info.start_with?("/thumbs")

    # Find javascript build if present
    @script = Dir.glob("public/static/js/script*.js").map {
      |fn| fn[7..-1]}[0]
    erb :index
  end
end
