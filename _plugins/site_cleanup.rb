Jekyll::Hooks.register :site, :post_write do |site|
  dest = site.config['destination']
  keep = %w[zh en assets feed.xml]
  Dir.children(dest).each do |entry|
    next if keep.include?(entry)
    next if entry == "index.html" && File.file?(File.join(dest, entry))
    path = File.join(dest, entry)
    next unless Dir.exist?(path) || File.file?(path)
    FileUtils.rm_rf(path)
    puts "  Cleaned: #{entry}"
  end
end
