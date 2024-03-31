const airdropsRoutes = require('../../routes/admin/airdrops');
const newsRoutes = require('../../routes/admin/news');
const gamesRoutes = require('../../routes/admin/games');

const express = require('express');

const router = express.Router();

router.use(airdropsRoutes);

router.use(newsRoutes);

router.use(gamesRoutes);

module.exports = router;
