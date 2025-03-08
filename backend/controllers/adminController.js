const Resignation = require('../models/Resignation');
const ExitQuestionnaire = require('../models/ExitQuestionnaire');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

/**
 * Get all resignations with employee details
 */
exports.getResignations = async (req, res) => {
    try {
        const resignations = await Resignation.find()
            .populate('employeeId', 'username email')
            .sort({ createdAt: -1 });
        
        res.json({ data: resignations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Process and conclude a resignation request
 * Updates resignation status and creates notification for employee
 */
exports.concludeResignation = async (req, res) => {
    try {
        const { resignationId, approved, lwd } = req.body;

        // Validate required fields
        if (!resignationId) {
            return res.status(400).json({ message: 'Resignation ID is required' });
        }

        // Validate resignationId format
        if (!mongoose.Types.ObjectId.isValid(resignationId)) {
            return res.status(400).json({ message: 'Invalid resignation ID format' });
        }

        // Validate approved field
        if (typeof approved !== 'boolean') {
            return res.status(400).json({ message: 'approved field must be a boolean' });
        }

        // Validate lwd when approving
        if (approved) {
            if (!lwd) {
                return res.status(400).json({ message: 'Last working day (lwd) is required when approving resignation' });
            }
            const lwdDate = new Date(lwd);
            if (isNaN(lwdDate.getTime())) {
                return res.status(400).json({ message: 'Invalid last working day date format. Use YYYY-MM-DD' });
            }
        }

        const resignation = await Resignation.findById(resignationId)
            .populate('employeeId', 'username email');

        if (!resignation) {
            return res.status(404).json({ message: 'Resignation not found' });
        }

        // Update resignation status
        resignation.status = approved ? 'approved' : 'rejected';
        if (approved) {
            resignation.approvedLwd = new Date(lwd);
        }

        await resignation.save();

        // Create notification for employee
        await Notification.create({
            userId: resignation.employeeId._id,
            title: `Resignation ${approved ? 'Approved' : 'Rejected'}`,
            message: approved
                ? `Your resignation has been approved. Last working day: ${new Date(lwd).toLocaleDateString()}`
                : 'Your resignation request has been rejected.'
        });

        res.json({ 
            message: 'Resignation updated successfully',
            data: resignation 
        });

    } catch (error) {
        console.error('Error in concludeResignation:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all exit questionnaire responses with employee details
 */
exports.getExitResponses = async (req, res) => {
    try {
        const responses = await ExitQuestionnaire.find()
            .populate('employeeId', 'username')
            .sort({ submittedAt: -1 });
        
        res.json({ data: responses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};