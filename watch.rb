require 'fssm'
require 'RMagick'
require 'fileutils'


def build_thumb(name)
  if name.downcase[-4..-1] == ".jpg" and name[0..6] != "_thumbs"
    img = Magick::Image::read("public/galleries/#{name}").first
    w = img.columns
    h = img.rows

    thmb_name = "public/thumbs/#{name}"
    FileUtils.mkdir_p File.dirname(thmb_name)

    nh = (600 / w) * h
    img.resize_to_fit!(600, nh)
    img.write(thmb_name)
  end
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


