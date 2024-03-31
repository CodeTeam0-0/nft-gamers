const embed = require("@brightcrowd/embed-video");

const Game = require("../../models/games");

exports.getAddGames = function (req, res, next) {
  try {
    return res.render("admin/add-games", {
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddGames = function (req, res, next) {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const youtubeLink = req.body.youtubeLink;
    const coinLink = req.body.coinLink;
    const like = req.body.like;

    embed.image(youtubeLink, { image: "maxresdefault" }, async (err, data) => {
      const game = new Game({
        title,
        description,
        youtubeLink,
        coinLink,
        like,
        imageUrl: data.src,
        userId: req.user._id,
      });

      await game.save();

      return res.redirect("/admin/add-games");
    });
  } catch (err) {
    next(err);
  }
};

exports.getGamesManage = async function (req, res, next) {
  try {
    const games = await Game.find();
    return res.render("admin/games-manage", {
      csrfToken: req.csrfToken(),
      games,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEditGame = async function (req, res, next) {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    return res.render("admin/edit-game", {
      csrfToken: req.csrfToken(),
      game,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditGame = async function (req, res, next) {
  try {
    const gameId = req.body.gameId;
    const game = await Game.findById(gameId);

    if (!game || game?.userId?.toString() !== req.user._id.toString()) {
      return res.redirect("/admin/games-manage");
    }

    const title = req.body.title;
    const description = req.body.description;
    const youtubeLink = req.body.youtubeLink;
    const coinLink = req.body.coinLink;
    const like = req.body.like;

    embed.image(youtubeLink, { image: "maxresdefault" }, async (err, data) => {
      game.title = title;
      game.description = description;
      game.youtubeLink = youtubeLink;
      game.coinLink = coinLink;
      game.like = like;
      game.imageUrl = data.src;

      await game.save();

      return res.redirect("/admin/games-manage");
    });
  } catch (err) {
    next(err);
  }
};

exports.postDeleteGames = async function (req, res, next) {
  try {
    const gameId = req.body.gameId;

    await Game.deleteOne({ _id: gameId, userId: req.user?._id });

    return res.redirect("/admin/games-manage");
  } catch (err) {
    next(err);
  }
};
