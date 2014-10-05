
$gallery_dir = "galleries/"



class Photo
  attr_accessor :gallery, :fname

  def initialize(gallery, fname)
    @gallery = gallery
    @fname = fname
  end

  def uri
    "/#{$gallery_dir}#{@gallery}/#{@fname}"
  end

  def thumb
    "/#{$gallery_dir}#{@gallery}/thumbs/#{@fname}"
  end

  def serialize
    {
      "uri" => self.uri,
      "thumb" => self.built? ? self.thumb : nil
    }
  end

  def mtime
    File.mtime("public/#{$gallery_dir}#{@gallery}/#{@fname}")
  end

  def built?
    File.exists?("public/#{self.thumb}")
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
      "photos" => self.photos.map { |p| p.serialize }
    }
  end

  def photos
    Dir.glob("public/#{$gallery_dir}#{@name}/*.{jpg,JPG}").map{ |fname|
      Photo.new(@name, fname.split("/")[-1])
    }.sort_by { |photo| photo.mtime }.reverse()
  end
end


def get_galleries
  Dir.glob("public/#{$gallery_dir}*").select{ |name|
    File.directory?(name)
  }.map{ |name|
    Gallery.new(name.split("/")[-1])
  }
end
