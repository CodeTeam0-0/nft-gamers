const express = require('express');

const newsController = require('../../controllers/admin/news');

const isAuth = require('../../middlewares/isAuth');

const router = express.Router();

router.get('/add-news', isAuth, newsController.getAddNews);

router.post('/add-news', isAuth, newsController.postAddNews);

router.get('/news-manage', isAuth, newsController.getNewsManager);

router.post('/delete-news', isAuth, newsController.postDeleteNews);

router.get('/edit-news/:newsId', isAuth, newsController.getEditNews);

router.post('/edit-news', isAuth, newsController.postEditNews);

router.post('/best', isAuth, newsController.postBestNews);

module.exports = router;
