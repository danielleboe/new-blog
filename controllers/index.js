const router = require("express").Router();
const apiRoutes = require("./api");
const bodyParser = require("body-parser");
const { Post } = require("../models");
const dayjs = require("dayjs");
const { ensureAuthenticated, isLoggedIn } = require("../utils/auth");
const methodOverride = require('method-override');

router.use("/api", apiRoutes);
router.use(bodyParser.json());
router.use(methodOverride('_method'));

// router.get("/blog-post", (req, res) => {
//   res.render("blogPost", { title: "Blog Post" , logged_in: isLoggedIn(req)});
// });


//render the blog posts on blogpost
router.get("/blog-post", async (req, res) => {
  try {
    const postData = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Map over the posts to format the createdAt date
    const posts = postData.map((post) => {
      const plainPost = post.get({ plain: true });

      // Format the createdAt date
      plainPost.createdAt = dayjs(plainPost.createdAt).format("MM/DD/YYYY");
      return plainPost;
    });

    res.render("blogPost", {
      title: "Blog Post",
      posts,
      logged_in: isLoggedIn(req),
    });
    // res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});




//render the blog posts on homepage
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Map over the posts to format the createdAt date
    const posts = postData.map((post) => {
      const plainPost = post.get({ plain: true });

      // Format the createdAt date
      plainPost.createdAt = dayjs(plainPost.createdAt).format("MM/DD/YYYY");
      return plainPost;
    });

    res.render("home", {
      title: "Tech Blog Home",
      posts,
      logged_in: isLoggedIn(req),
    });
    // res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});


//render the blog posts on dashboard
router.get("/dashboard", async (req, res) => {
  try {
    console.log('The user on session +++++++++++++++++++++++++', req.user);
    const postData = await Post.findAll({
      where: {user_id: req.user.id},
      order: [["createdAt", "DESC"]],
    });

    // Map over the posts to format the createdAt date
    const posts = postData.map((post) => {
      const plainPost = post.get({ plain: true });

      // Format the createdAt date
      plainPost.createdAt = dayjs(plainPost.createdAt).format("MM/DD/YYYY");
      return plainPost;
    });

    res.render("dashboard", {
      title: "Dashboard",
      posts,
      logged_in: isLoggedIn(req),
    });
    // res.status(200);
  } catch (err) {
    console.log(`dashboard error`, err);
    res.status(500).json(err);
  }
});


router.get("/blog-form", (req, res) => {
  res.render("blogForm", { title: "Create New Blog Post" ,
    logged_in: isLoggedIn(req),
  });
});



module.exports = router;
