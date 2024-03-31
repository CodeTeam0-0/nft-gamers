const express = require('express');

const authController = require('../../controllers/auth/auth');

const router = express.Router();

router.get(
  '/login',
  function (req, res, next) {
    if (req.user) {
      return res.redirect('/admin/add-news');
    }
    next();
  },
  authController.getLogin
);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;
