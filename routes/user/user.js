const express = require('express');

const userController = require('../../controllers/user/user');

const isNotAuth = require('../../middlewares/isNotAuth');

const router = express.Router();

router.get('/', isNotAuth, userController.getHome);

router.get('/game/:gameId', isNotAuth, userController.getDetailGame);

router.get('/news/:newsId', isNotAuth, userController.getDetailNews);

router.get('/airdrop/:airdropId', isNotAuth, userController.getDetailAirdrop);

module.exports = router;
