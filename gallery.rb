# gallery.rb

class Photo
  attr_accessor :gallery, :fname

  def initialize(gallery, fname)
    @gallery = gallery
    @fname = fname
  end

  def uri
    "/galleries/#{@gallery}/#{@fname}"
  end

  def thumb
    "/thumbs/#{@gallery}/#{@fname}"
  end

  def serialize
    {
      "uri" => self.uri,
      "thumb" => self.thumb
    }
  end

  def ctime
    File.ctime("public/galleries/#{@gallery}/#{@fname}")
  end
end


class Gallery
  attr_accessor :name, :cached_photos

  def initialize(name)
    @name = name
    @cached_photos = nil
  end

  def serialize(limit=false)
    if limit and self.photos
      photos = self.photos[0].serialize
    else
      photos = self.photos.map{ |p| p.serialize }
    end

    {
      "name" => @name,
      "formattedName" => @name.gsub("-", " "),
      "photos" => photos
    }
  end

  def photos
    if cached_photos
      return cached_photos
    end
    Dir.glob("public/galleries/#{@name}/*.{jpg,JPG}").map{ |fname|
      Photo.new(@name, fname.split("/")[-1])
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
