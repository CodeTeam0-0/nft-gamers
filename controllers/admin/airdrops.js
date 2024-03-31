const embed = require("@brightcrowd/embed-video");

const Airdrop = require("../../models/airdrops");

exports.getAddAirdrop = function (req, res, next) {
  try {
    return res.render("admin/add-airdrops", {
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.postAddAirdrop = async function (req, res, next) {
  try {
    const body = req.body;

    const title = body.title;
    const youtubeLink = body.youtubeLink;
    const description = body.description;

    embed.image(youtubeLink, { image: "maxresdefault" }, async (err, data) => {
      const airdrop = new Airdrop({
        title,
        youtubeLink,
        description,
        userId: req.user._id,
        imageUrl: data.src,
        isDone: false,
      });

      await airdrop.save();

      return res.redirect("/admin/add-airdrops");
    });
  } catch (err) {
    return next(err);
  }
};

exports.getAirdropManage = async function (req, res, next) {
  try {
    const airdrops = await Airdrop.find();

    return res.render("admin/airdrops-manage", {
      csrfToken: req.csrfToken(),
      airdrops,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEditAirdrop = async function (req, res, next) {
  try {
    const airdropId = req.params.airdropId;

    const airdrop = await Airdrop.findById(airdropId);

    if (
      !airdrop ||
      airdrop?.userId?.toString() !== req?.user?._id?.toString()
    ) {
      return res.redirect("/admin/airdrops-manage");
    }

    return res.render("admin/edit-airdrop", {
      csrfToken: req.csrfToken(),
      airdrop,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditAirdrop = async function (req, res, next) {
  try {
    const airdropId = req.body.airdropId;

    const airdrop = await Airdrop.findById(airdropId);

    if (
      !airdrop ||
      airdrop?.userId?.toString() !== req?.user?._id?.toString()
    ) {
      return res.redirect("/admin/airdrops-manage");
    }

    embed.image(youtubeLink, { image: "maxresdefault" }, async (err, data) => {
      airdrop.title = req.body.title;
      airdrop.description = req.body.description;
      airdrop.youtubeLink = req.body.youtubeLink;
      airdrop.imageUrl = data.src;
      await airdrop.save();

      return res.redirect("/admin/airdrops-manage");
    });
  } catch (err) {
    return next(err);
  }
};

exports.postDeleteAirdrop = async function (req, res, next) {
  try {
    await Airdrop.deleteOne({ _id: req.body.airdropId, userId: req.user._id });
    return res.redirect("/admin/airdrops-manage");
  } catch (err) {
    return next(err);
  }
};

exports.postSwitchAirdrop = async function (req, res, next) {
  try {
    const airdrop = await Airdrop.findOne({
      _id: req.body.airdropId,
      userId: req.user._id,
    });

    if (!airdrop) {
      return res.redirect("/admin/airdrops-manage");
    }

    airdrop.isDone = !airdrop.isDone;
    await airdrop.save();

    return res.redirect("/admin/airdrops-manage");
  } catch (err) {
    return next(err);
  }
};
