const express = require('express');
const router = express.Router();
const { getPlaylists, getAllPlaylists, createPlaylist, updatePlaylist, deletePlaylist } = require('../controllers/playlistController');

router.get('/', getPlaylists);
router.get('/all', getAllPlaylists);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

module.exports = router;
