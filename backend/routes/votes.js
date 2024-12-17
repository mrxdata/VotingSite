const express = require('express');
const router = express.Router();
const { submitVote } = require('../controllers/voteController'); // Импортируем функцию из контроллера

router.post('/votes', submitVote);

module.exports = router;
