var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Post = require('../models/post');
const fs = require('fs');
const moment = require('moment-timezone');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true});

/* GET home page. */
router.get('/', authenticationEnsurer, csrfProtection, function(req, res, next) {
  if (req.user) {
    Post.findAll({
      order: [
        ['"createdAt"', 'DESC']
      ]
    }).then((Post) => {
         Post.forEach((post) => {
           post.formattedCreatedAt = moment(post.postedAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
         });
      res.render('index', {
        user: req.user,
        posts: Post,
        csrfToken: req.csrfToken()
      });
    });
  }

});

router.post('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  console.log(req.body);
  const postedAt = new Date();

  switch (req.url) {
    case '/':
      Post.create({
        postedBy: req.user.displayName,
        content: req.body.content,
        postId: req.user.id,
        postedAt: postedAt
      }).then(() => {
        res.redirect('/');
      });
      break;

    case '/?delete=1':
      Post.findById(req.body.id).then((post) => {
        if (parseInt(post.postId) === parseInt(req.user.id)) {
          post.destroy({
            truncate: true
          });
        }
      }).then(() => {
        res.redirect('/');
      });
      break;

    case '/favicon.ico':
      function handleFavicon(req, res) {
        res.writeHead(200, {
          'Content-Type': 'image/vnd.microsoft.icon'
        });
        const favicon = fs.readFileSync('../favicon.ico');
        res.end(favicon);
      }
      handleFavicon(req, res);
      break;

    default:
      res.redirect('/');
      break;
  }
})

module.exports = router;