const express = require('express');
const { validate } = require('express-validation');

const router = express.Router();
const controller = require('../../controllers/art.controller');
const { getAllArts, getArtById, createArtComment } = require('../../validations/art.validation');

router.get('/', validate(getAllArts), controller.getAll);
router.get('/:artID', validate(getArtById), controller.getById);
router.post('/:artID/comments', validate(createArtComment), controller.createArtComment);

module.exports = router;
