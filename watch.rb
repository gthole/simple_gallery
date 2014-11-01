require 'fssm'
require 'RMagick'
require 'fileutils'


def build_thumbs(name)
  if name.downcase[-4..-1] != ".jpg" or name.count("/") != 1
    return
  end

  puts "Create thumb for #{name}"
  gallery, base = name.split("/")

  img = Magick::Image::read("public/galleries/#{name}").first
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


FSSM.monitor("public/galleries/", '**/*') do
  update do |b, r, t|
    build_thumbs(r)
  end

  create do |b, r, t|
    build_thumbs(r)
  end
end


