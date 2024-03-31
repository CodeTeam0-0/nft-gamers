const bcrypt = require('bcrypt');
const User = require('../../models/user');

exports.getLogin = function (req, res, next) {
  res.render('auth/login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
    errorMessage: '',
  });
};

exports.postLogin = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(402).render('auth/login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
      errorMessage: 'Wrong email!',
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(402).render('auth/login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
      errorMessage: 'Wrong password!',
    });
  }

  req.session.userId = user._id;
  return res.redirect('/admin/add-news');
};

exports.postLogout = async function (req, res, next) {
  try {
    await req.session.destroy();
  } catch (err) {
    return next(err);
  }
  return res.redirect('/');
};
