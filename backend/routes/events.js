const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/create-event', authenticateJWT, eventsController.createEvent);
router.get('/events', eventsController.getAllEvents);
router.get('/events/:event_id', eventsController.getEventById);

module.exports = router;
