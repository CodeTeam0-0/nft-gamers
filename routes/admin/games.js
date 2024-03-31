const express = require('express');

const gamesController = require('../../controllers/admin/games');

const isAuth = require('../../middlewares/isAuth');

const router = express.Router();

router.get('/add-games', isAuth, gamesController.getAddGames);

router.post('/add-games', isAuth, gamesController.postAddGames);

router.get('/games-manage', isAuth, gamesController.getGamesManage);

router.get('/edit-game/:gameId', isAuth, gamesController.getEditGame);

router.post('/edit-game', isAuth, gamesController.postEditGame);

router.post('/delete-game', isAuth, gamesController.postDeleteGames);

module.exports = router;
