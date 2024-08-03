const express = require('express');
const router = express.Router();
const { getSummaries, createSummary, updateSummary, deleteSummary } = require('../controllers/summaryController');

router.get('/', getSummaries);
router.post('/', createSummary);
router.put('/:id', updateSummary);
router.delete('/:id', deleteSummary);

module.exports = router;
