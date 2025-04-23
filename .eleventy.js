module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy('./src/styles.css');
  eleventyConfig.addPassthroughCopy('./src/hamburgers.css');
  eleventyConfig.addPassthroughCopy('./src/normalize.css');
  eleventyConfig.addPassthroughCopy('./src/fonts');
  eleventyConfig.addPassthroughCopy('./src/images');
  eleventyConfig.addPassthroughCopy('./src/js');
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./static');

  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      return item.data.featured === true;
    });
  });

  eleventyConfig.addCollection("portfolio", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/portfolio/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);  // Sort by date, most recent first
    });
  });

  eleventyConfig.addCollection("testimonials", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/testimonials/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);  // Sort by date, most recent first
    });
  });

  eleventyConfig.addCollection("recentPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date) // Sort by date, newest first
      .slice(0, 3); // Get only the 3 most recent posts
  });

  eleventyConfig.addTransform("fix-img-paths-and-figcaption", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      // 1. Prefix /img/ with /static/img/
      content = content.replace(/src="\/img\//g, 'src="/static/img/');

      // 2. Wrap <img> with title in <figure><img><figcaption></figcaption></figure>
      content = content.replace(
        /<img([^>]*?)title="(.*?)"([^>]*?)>/g,
        (match, beforeTitle, titleText, afterTitle) => {
          return `<figure><img${beforeTitle}${afterTitle}><figcaption>${titleText}</figcaption></figure>`;
        }
      );

      return content;
    }
    return content;
  });


  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
}
