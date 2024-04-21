const embed = require('@brightcrowd/embed-video');

function matchYoutubeUrl(url) {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
}

const Game = require('../../models/games');

exports.getAddGames = function (req, res, next) {
  try {
    return res.render('admin/add-games', {});
  } catch (err) {
    next(err);
  }
};

exports.postAddGames = async function (req, res, next) {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const youtubeLink = req.body.youtubeLink;
    const coinLink = req.body.coinLink;
    const like = req.body.like;

    if (matchYoutubeUrl(youtubeLink)) {
      embed.image(
        youtubeLink,
        { image: 'maxresdefault' },
        async (err, data) => {
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

          return res.redirect('/admin/add-games');
        }
      );
    } else {
      const game = new Game({
        title,
        description,
        youtubeLink,
        coinLink,
        like,
        imageUrl: youtubeLink,
        userId: req.user._id,
      });

      await game.save();

      return res.redirect('/admin/add-games');
    }
  } catch (err) {
    next(err);
  }
};

exports.getGamesManage = async function (req, res, next) {
  try {
    const games = await Game.find();
    return res.render('admin/games-manage', {
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

    return res.render('admin/edit-game', {
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
      return res.redirect('/admin/games-manage');
    }

    const title = req.body.title;
    const description = req.body.description;
    const youtubeLink = req.body.youtubeLink;
    const coinLink = req.body.coinLink;
    const like = req.body.like;

    if (matchYoutubeUrl(youtubeLink)) {
      embed.image(
        youtubeLink,
        { image: 'maxresdefault' },
        async (err, data) => {
          game.title = title;
          game.description = description;
          game.youtubeLink = youtubeLink;
          game.coinLink = coinLink;
          game.like = like;
          game.imageUrl = data.src;
        }
      );
    } else {
      game.title = title;
      game.description = description;
      game.youtubeLink = youtubeLink;
      game.coinLink = coinLink;
      game.like = like;
      game.imageUrl = youtubeLink;

      await game.save();

      return res.redirect('/admin/games-manage');
    }
  } catch (err) {
    next(err);
  }
};

exports.postDeleteGames = async function (req, res, next) {
  try {
    const gameId = req.body.gameId;

    await Game.deleteOne({ _id: gameId, userId: req.user?._id });

    return res.redirect('/admin/games-manage');
  } catch (err) {
    next(err);
  }
};
