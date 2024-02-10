const models = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { name, age, location } = req.body;

    const result = await models.User.create({
      name,
      age,
      location,
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    const totalItems = await models.User.count();
    const users = await models.User.findAll({
      offset,
      limit,
    });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: users,
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
