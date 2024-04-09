const embed = require('@brightcrowd/embed-video');

const Game = require('../../models/games');
const Airdrop = require('../../models/airdrops');
const News = require('../../models/news');
const User = require('../../models/user');

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}

function breakDown(str) {
  const separateLines = str.split(/\r?\n|\r|\n/g);
  return separateLines.join('<br>');
}

function textConverse(text) {
  const urlText = urlify(text);

  const breakDownText = breakDown(urlText);

  return breakDownText;
}

exports.getHome = async function (req, res, next) {
  try {
    const airdrops = await Airdrop.find();
    let games = await Game.find();
    games = games.sort((a, b) => b.like - a.like);
    const news = await News.find();
    const user = await User.findOne();
    const bestNews = await News.findById(user.bestNews);

    res.render('user/index', {
      airdrops,
      games,
      news,
      bestNews,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDetailGame = async function (req, res, next) {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.redirect('/');
    }

    const videoEmbed = embed(game.youtubeLink);

    game.description = textConverse(game.description);

    return res.render('user/detail', {
      title: 'Game Details',
      page: 'gameDetail',
      airdrop: {},
      game,
      videoEmbed,
      news: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.getDetailAirdrop = async function (req, res, next) {
  try {
    const airdropId = req.params.airdropId;
    const airdrop = await Airdrop.findById(airdropId);

    if (!airdrop) {
      return res.redirect('/');
    }

    const videoEmbed = embed(airdrop.youtubeLink);

    airdrop.description = textConverse(airdrop.description);

    return res.render('user/detail', {
      title: 'Airdrop Details',
      page: 'airdropDetail',
      airdrop,
      videoEmbed,
      game: {},
      news: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.getDetailNews = async function (req, res, next) {
  try {
    const newsId = req.params.newsId;
    const news = await News.findById(newsId);

    if (!news) {
      return res.redirect('/');
    }

    news.description = textConverse(news.description);

    return res.render('user/detail', {
      title: 'News Details',
      page: 'newsDetail',
      airdrop: {},
      game: {},
      videoEmbed: '',
      news,
    });
  } catch (err) {
    next(err);
  }
};
