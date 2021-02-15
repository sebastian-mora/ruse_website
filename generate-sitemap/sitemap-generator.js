require("babel-register")({
  presets: ["es2015", "react"]
});
 
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const api = require('../src/api/blogsApi')


async function generateSitemap() {
  let blogMap = [];

  api.getAllBlogs()
    .then(res => {
      const posts = res.data;

      for(var i = 0; i < posts.length; i++) {
        blogMap.push({ slug: posts[i].path });
      }

      console.log("Adding Dynamic Routes");
      blogMap.map((path) => {
        console.log('/blogs/' + path.slug);
      })

      const paramsConfig = {
        "/blogs/:slug": blogMap
      };
    
      return (

        new Sitemap(router)
            .applyParams(paramsConfig)
            .build("https://ruse.tech")
            .save("./public/sitemap.xml")
        );
    })

    .catch( (err) => {
      console.error(err);
      console.error("failed to generate site map. Check the API is working")
    })
  


}

generateSitemap();
