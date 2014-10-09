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

  def mtime
    File.mtime("public/galleries/#{@gallery}/#{@fname}")
  end
end


class Gallery
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def serialize
    {
      "name" => @name,
      "formattedName" => @name.gsub("-", " "),
      "photos" => self.photos.map { |p| p.serialize }
    }
  end

  def photos
    Dir.glob("public/galleries/#{@name}/*.{jpg,JPG}").map{ |fname|
      Photo.new(@name, fname.split("/")[-1])
    }.sort_by { |photo| photo.mtime }.reverse()
  end
end


def get_galleries
  Dir.glob("public/galleries/*").select{ |name|
    File.directory?(name)
  }.map{ |name|
    Gallery.new(name.split("/")[-1])
  }
end
