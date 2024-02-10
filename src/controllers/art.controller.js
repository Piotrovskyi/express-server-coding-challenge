const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const totalItems = await models.Art.count();
    const arts = await models.Art.findAll({
      offset,
      limit,
      include: 'comments',
    });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: arts,
      pageInfo: {
        totalItems,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { artID } = req.params;
    const art = await models.Art.findByPk(artID, {
      include: 'comments',
    });
    if (!art) {
      res.status(404).json({ message: 'Art not found', data: null });
      return;
    }

    res.status(200).json({ data: art });
  } catch (error) {
    next(error);
  }
};

exports.createArtComment = async (req, res, next) => {
  try {
    let { artID } = req.params;
    const { userID, name, content } = req.body;

    artID = parseInt(artID, 10);

    // validate dependencies
    let user = null;
    if (userID) {
      user = await models.User.findByPk(userID);
      if (!user) {
        res.status(400).json({ message: 'User not exist', data: null });
        return;
      }
    } else {
      const commentWithNameExist = await models.Comment.findOne({ where: { name, artID } });
      if (commentWithNameExist) {
        res.status(400).json({ message: 'Guest user can\'t comment twice', data: null });
        return;
      }
    }

    const art = await models.Art.findByPk(artID);
    if (!art) {
      res.status(400).json({ message: 'Art not exist', data: null });
      return;
    }

    // create comment
    const result = await models.Comment.create({
      userID,
      artID,
      name: user ? user.name : name,
      content,
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};
