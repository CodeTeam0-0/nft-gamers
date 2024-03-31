const express = require('express');

const airdropsController = require('../../controllers/admin/airdrops');

const isAuth = require('../../middlewares/isAuth');

const router = express.Router();

router.get('/add-airdrops', isAuth, airdropsController.getAddAirdrop);

router.post('/add-airdrops', isAuth, airdropsController.postAddAirdrop);

router.get('/airdrops-manage', isAuth, airdropsController.getAirdropManage);

router.get(
  '/edit-airdrop/:airdropId',
  isAuth,
  airdropsController.getEditAirdrop
);

router.post('/edit-airdrop', isAuth, airdropsController.postEditAirdrop);

router.post('/delete-airdrop', isAuth, airdropsController.postDeleteAirdrop);

router.post('/switch-airdrop', isAuth, airdropsController.postSwitchAirdrop);

module.exports = router;
