const New = require('../../models/news');

const fs = require('fs');
const path = require('path');
const User = require('../../models/user');

exports.getAddNews = function (req, res, next) {
  try {
    res.render('admin/add-news', {
      title: 'Add News',
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddNews = async function (req, res, next) {
  try {
    let imageUrl = req.body.image;
    const title = req.body.title;
    const description = req.body.description;

    imageUrl = `https://lh3.googleusercontent.com/d/${imageUrl.split('/')[5]}`;

    const news = new New({
      title,
      description,
      imageUrl,
      userId: req.user._id,
    });
    await news.save();
    return res.redirect('/admin/add-news');
  } catch (err) {
    next(err);
  }
};

exports.getNewsManager = async function (req, res, next) {
  try {
    const news = await New.find();
    return res.render('admin/news-manage.ejs', {
      news,
    });
  } catch (err) {
    next(err);
  }
};

exports.postDeleteNews = async function (req, res, next) {
  try {
    const newsId = req.body.newsId;
    const news = await New.findById(newsId);
    if (!news || news?.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/admin/news-manage');
    }

    if (req.user?.bestNews?.toString() === news._id.toString()) {
      const user = await User.findById(req.user._id);

      user.bestNews = undefined;

      await user.save();
    }

    await New.deleteOne({ _id: newsId });
    return res.redirect('/admin/news-manage');
  } catch (err) {
    next(err);
  }
};

exports.getEditNews = async function (req, res, next) {
  try {
    const newsId = req.params.newsId;
    const news = await New.findById(newsId);
    if (!news || news?.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/admin/news-manage');
    }

    return res.render('admin/edit-news', {
      news,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditNews = async function (req, res, next) {
  const newsId = req.body.newsId;
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.image;

  try {
    const news = await New.findById(newsId);
    if (!news || news?.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/admin/news-manage');
    }

    news.title = title;
    news.description = description;
    news.imageUrl = `https://lh3.googleusercontent.com/d/${
      imageUrl.split('/')[5]
    }`;

    await news.save();
    return res.redirect('/admin/news-manage');
  } catch (err) {
    return next(err);
  }
};

exports.postBestNews = async function (req, res, next) {
  try {
    const newsId = req.body.newsId;

    const news = await New.findById(newsId);

    if (!news || news?.userId?.toString() !== req.user?._id.toString()) {
      return res.redirect('/admin/news-manage');
    }

    const user = await User.findById(req.user._id);

    user.bestNews = news._id;

    await user.save();
    return res.redirect('/admin/news-manage');
  } catch (err) {
    return next(err);
  }
};
