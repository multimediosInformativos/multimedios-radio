const express = require('express');
const router = express.Router();
const { getMessages, createMessage, deleteMessage, updateMessage } = require('../controllers/chatController');

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/:id', deleteMessage);
router.put('/:id', updateMessage);

module.exports = router;
