const embed = require("@brightcrowd/embed-video");

const Game = require("../../models/games");
const Airdrop = require("../../models/airdrops");
const News = require("../../models/news");
const User = require("../../models/user");

exports.getHome = async function (req, res, next) {
  try {
    const airdrops = await Airdrop.find();
    let games = await Game.find();
    games = games.sort((a, b) => b.like - a.like);
    const news = await News.find();
    const user = await User.findOne();
    const bestNews = await News.findById(user.bestNews);

    res.render("user/index", {
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

    const videoEmbed = embed(game.youtubeLink);

    if (!game) {
      return res.redirect("/");
    }

    return res.render("user/detail", {
      title: "Game Details",
      page: "gameDetail",
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

    const videoEmbed = embed(airdrop.youtubeLink);

    if (!airdrop) {
      return res.redirect("/");
    }

    return res.render("user/detail", {
      title: "Airdrop Details",
      page: "airdropDetail",
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
      return res.redirect("/");
    }

    return res.render("user/detail", {
      title: "News Details",
      page: "newsDetail",
      airdrop: {},
      game: {},
      videoEmbed: "",
      news,
    });
  } catch (err) {
    next(err);
  }
};
