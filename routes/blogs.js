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
    { title: 'title 1', image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: 'I love this application' },
    { title: 'title 2', image: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: 'I hate this application' },
    { title: 'title 3', image: 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', body: 'I dont know this application' }];

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
router.post('/', (req, res) => {
  const { blog } = req.body;
  console.log(blog);

  Blog.create(blog, (err, savedBlog) => {
    if (err) {
      return console.log().call(console, `Error when saving blog ${blog}; ${err}`);
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

module.exports = router;
