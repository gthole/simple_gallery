require 'RMagick'
require 'fileutils'


def build_thumbs(name)
  if name.downcase[-4..-1] != ".jpg" or name.count("/") != 1
    return
  end

  puts "Create thumb for #{name}"
  gallery, base = name.split("/")

  img = Magick::Image::read("public/galleries/#{name}").first

  # Orient the image before building thumbs
  img.auto_orient!
  img.write("public/galleries/#{name}")

  thmb_dir = "public/galleries/#{gallery}/_thumbs/"

  build_thumb(base, img, thmb_dir, 300)
  build_thumb(base, img, thmb_dir, 600)
end


def build_thumb(base, img, thmb_dir, width)
  w = img.columns
  h = img.rows

  thmb_name = "#{thmb_dir}/#{width}/#{base}"
  FileUtils.mkdir_p File.dirname(thmb_name)

  nh = (width / w) * h
  new = img.resize_to_fit(width, nh)
  new.write(thmb_name)
end


def pkey(file_name)
  gal, name = file_name.split("/")[-2..-1]
  return gal, name, "#{gal}/#{name}"
end


# Walk the directories on load to make sure all thumbs exist
# Build a hash of all the photo sizes to check for updates
fHash = {}
Dir.glob("public/galleries/*/*.{jpg,JPG}").each{ |file|
  gal, name, key = pkey(file)
  fHash[key] = File.size(file)
  if not (File.exists?("public/galleries/#{gal}/_thumbs/300/#{name}") and
          File.exists?("public/galleries/#{gal}/_thumbs/600/#{name}"))
    build_thumbs(key)
  end
}


# Poll the directory every 2 minutes and update the thumbs if the file
# size has changed
while true do
  Dir.glob("public/galleries/*/*.{jpg,JPG}").each{ |file|
    _, _, key = pkey(file)
    size = File.size(file)
    if not (fHash[key] == size)
      build_thumbs(key)
      fHash[key] = size
    end
  }
  sleep 120
end
