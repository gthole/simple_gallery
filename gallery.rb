# gallery.rb
require 'yaml'

class Photo
  attr_accessor :gallery, :fname

  def initialize(gallery, fname)
    @gallery = gallery
    @fname = fname
  end

  def ctime
    File.ctime("public/galleries/#{@gallery}/#{@fname}")
  end
end


class Gallery
  attr_accessor :name, :cached_photos

  def initialize(id)
    @id = id
    @cached_photos = []
  end

  def serialize()
    photos = self.photos.map{ |p| p.fname }

    # Defaults
    gal_data = {
      "name" => @id.gsub("-", " "),
      "description" => "",
      "lead" => photos.sample
    }

    meta_file = "public/galleries/#{@id}/meta.yaml"
    if File.exists? meta_file
      # Get gallery meta information
      gal_data.merge!(YAML.load_file(meta_file)) 
    end

    gal_data["id"] = @id
    gal_data["photos"] = photos

    gal_data
  end

  def photos
    if cached_photos.length > 0
      return cached_photos
    end
    Dir.glob("public/galleries/#{@id}/*.{jpg,JPG}").map{ |fname|
      Photo.new(@id, fname.split("/")[-1])
    }.sort_by { |photo| photo.ctime }
  end
end


def get_galleries
  Dir.glob("public/galleries/*").select{ |name|
    File.directory?(name)
  }.map{ |name|
    Gallery.new(name.split("/")[-1])
  }
end
