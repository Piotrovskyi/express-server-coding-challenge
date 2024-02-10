const express = require('express');
const { validate } = require('express-validation');

const {
  createUser, getAllUsers,
} = require('../../validations/user.validation');

const router = express.Router();
const controller = require('../../controllers/user.controller');

router.get('/', validate(getAllUsers), controller.getAll);
router.post('/', validate(createUser), controller.create);

module.exports = router;
