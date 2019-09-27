/* eslint-disable consistent-return */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


// ------------ connect to db
const dbName = 'restful_blog';
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

// ----------- create Schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// ----------- mock blogs
// loadMockBlogs(); // run only once
function loadMockBlogs() {
  const inMemoryDb = [
    { title: 'I\'m alive', image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: '<p>Lorem Ipsum is simply dummy text of the <cite>printing and typesetting industry</cite>.</p><p> Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>' },
    { title: 'Success within reach', image: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: '<em>Lorem Ipsum</em> is simply <strong>dummy text</strong> of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { title: 'You can do it!', image: 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: 'It is a long <small>established</small> fact that a <i>reader</i> will be distracted by the <del>readable</del> content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).' }];

  inMemoryDb.forEach((blog) => {
    Blog.create(blog, (err, savedBlog) => {
      if (err) return console.log().call(console, `Error when creating mock blogs: ${err}`);

      console.log(`Mock blog has been loaded: \n${savedBlog}`);
    });
  });
}

// ------------ routes

// INDEX /blogs/
router.get('/', (req, res) => {
  Blog.find({}, (err, loadedBlogs) => {
    if (err) return console.log().call(console, `Error when loading mock blogs: ${err}`);

    res.render('index', { blogs: loadedBlogs, msg: 'Posts loaded from db' });
  });
});

// NEW /blogs/new
router.get('/new', (req, res) => {
  res.render('new');
});

// CREATE
// needs sanitization
router.post('/', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog, (err, savedBlog) => {
    if (err) {
      return console.log().call(console, `Error when saving blog ${req.body.blog}; ${err}`);
    }
    console.log(`Has saved blog: \n${savedBlog}`);

    res.redirect('/blogs');
  });
});

// SHOW
// /blogs/23hjkas
router.get('/:id', (req, res) => {
  console.log('---------------------------------/:id');

  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      return console.log().call(console, `Error when retrieving blog with id ${req.params.id}; ${err}`);
    }
    res.render('show', { blog: foundBlog });
  });
});

// EDIT
// /blogs/:id/edit
router.get('/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      return console.log().call(console, `Error when retrieving blog with id ${req.params.id}; ${err}`);
    }
    res.render('edit', { blog: foundBlog });
  });
});

// UPDATE
// PUT /blogs/:id
// needs sanitization
router.put('/:id', (req, res) => { // PUT uses this part of query string: _method=PUT
  req.body.blog.body = req.sanitize(req.body.blog.body); // object destructuring: same as req.body.blog
  const blogId = req.params.id;

  Blog.findByIdAndUpdate(blogId, req.body.blog, (err, updatedBlog) => {
    if (err) {
      return console.log().call(console, `Error when retrieving blog ${updatedBlog}; ${err}`);
    }
    res.redirect(`/blogs/${blogId}`);
  });
});

// DESTROY
// DELETE /blogs/:id
router.delete('/:id', (req, res) => {
  const blogId = req.params.id;

  Blog.findByIdAndDelete(blogId, (err) => {
    if (err) {
      return console.log().call(console, `Error when deleting blog with id ${blogId}. ${err}`);
    }
    res.redirect('/blogs');
  });
});

module.exports = router;
