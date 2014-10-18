require 'fssm'
require 'RMagick'
require 'fileutils'


def build_thumb(name)
  if name.downcase[-4..-1] != ".jpg" or name.count("/") != 1
    return
  end

  puts "Create thumb for #{name}"
  gallery, base = name.split("/")

  img = Magick::Image::read("public/galleries/#{name}").first
  w = img.columns
  h = img.rows

  thmb_name = "public/galleries/#{gallery}/_thumbs/#{base}"
  FileUtils.mkdir_p File.dirname(thmb_name)

  nh = (300 / w) * h
  img.resize_to_fit!(300, nh)
  img.write(thmb_name)
end


FSSM.monitor("public/galleries/", '**/*') do
  update do |b, r, t|
    build_thumb(r)
  end

  create do |b, r, t|
    build_thumb(r)
  end

  delete do |b, r, t|
    puts "Delete thumb for #{r}"
  end
end


