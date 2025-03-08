const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/resign', auth, userController.submitResignation);
router.get('/resignation_status', auth, userController.getResignationStatus);
router.post('/responses', auth, userController.submitExitQuestionnaire);
router.get('/responses/status', auth, userController.checkQuestionnaireStatus);
router.get('/notifications', auth, userController.getNotifications);
router.put('/notifications/:id/read', auth, userController.markNotificationRead);

module.exports = router;