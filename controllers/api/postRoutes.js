const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const { isLoggedIn } = require("../../utils/auth");


// // GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
    //   include: [],
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve posts', error: err });
  }
});

// GET a single post
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [User],
        },
        {
          model: User,
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render('blogPost', { 
      title: "Blog Post",
      post, 
      logged_in: isLoggedIn(req) });
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a new post
// Route to handle the form submission
router.post('/', async (req, res) => {
  try {
    const { username, blogTitle, blogContent } = req.body;
    // console.log(`blogcontent@@@@@`,blogContent, blogTitle);

    const newPost = await Post.create({
      user_id: req.user.id,
      post_title: blogTitle,
      post_txt: blogContent,
    });

    res.redirect(`/posts/${newPost.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

////edit post
router.get('/:id/edit', async (req, res) => {
  const postId = req.params.id;
  try {
      const editPost = await Post.findByPk(postId);
      if (editPost) {
          res.render(  'edit-post', 
            {  title: "Edit Post",
              post: editPost.get({ plain: true }), 
            logged_in: isLoggedIn(req) }); // Pass plain object

      } else {
          res.status(404).send('Post not found');
      }
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});



// PUT
router.put('/:id', async (req, res) => {
  const postId = req.params.id;
  const { blogTitle, blogContent } = req.body;

  try {
      // Fetch the post by ID
      const updatePost = await Post.findByPk(postId);

      // Check if the post exists
      if (!updatePost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Update the post's title and content
      updatePost.post_title = blogTitle;
      updatePost.post_txt = blogContent;

      // Save the updated post
      await updatePost.save();

      // Redirect to the updated post's page
      // res.redirect(`/dashboard`);
  } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});




// // DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// module.exports = router;

// Route to display the form to create a new post
router.get('/blogForm', (req, res) => {
  res.render('blogForm');
});



module.exports = router;
