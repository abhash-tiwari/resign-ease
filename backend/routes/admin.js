const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/resignations', auth, isAdmin, adminController.getResignations);
router.put('/conclude_resignation', auth, isAdmin, adminController.concludeResignation);
router.get('/exit_responses', auth, isAdmin, adminController.getExitResponses);

module.exports = router;