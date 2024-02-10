const express = require('express');
const userRoutes = require('./user.route');
const artRoutes = require('./art.route');

const router = express.Router();

router.get('/health', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/art', artRoutes);

module.exports = router;
