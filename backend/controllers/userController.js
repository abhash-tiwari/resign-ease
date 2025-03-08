const Resignation = require('../models/Resignation');
const ExitQuestionnaire = require('../models/ExitQuestionnaire');
const Notification = require('../models/Notification');
const { checkHoliday } = require('../utils/holidayService');

exports.submitResignation = async (req, res) => {
  try {
    const { lwd } = req.body;
    
    if (!lwd) {
      return res.status(400).json({
        message: "Last working day (LWD) is required",
      });
    }
    const lastWorkingDay = new Date(lwd);
    
  
    if (isNaN(lastWorkingDay.getTime())) {
      return res.status(400).json({
        message: "Invalid date format for last working day",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (lastWorkingDay < today) {
      return res.status(400).json({
        message: "Last working day cannot be in the past",
      });
    }


    const dayOfWeek = lastWorkingDay.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({
        message: "Last working day cannot be on a weekend",
      });
    }


    const isHoliday = await checkHoliday(lastWorkingDay);
    if (isHoliday) {
      return res.status(400).json({
        message: "Last working day cannot be a holiday",
      });
    }

    console.log("User from request:", req.user);

    const employeeId = req.user?.id;
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required",
      });
    }


    const existingResignation = await Resignation.findOne({
      employeeId,
      status: { $in: ["pending"] },
    });

    if (existingResignation) {
      return res.status(400).json({
        message: "You have already applied for resignation. Please wait for approval or rejection.",
      });
    }


    const resignation = await Resignation.create({
      employeeId,
      lwd: lastWorkingDay,
      status: "pending",
    });

    res.status(201).json({
      data: {
        resignation: {
          _id: resignation._id,
        },
      },
    });
  } catch (error) {
    console.error("Error in submitResignation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getResignationStatus = async (req, res) => {
  try {
    const resignation = await Resignation.findOne({ 
      employeeId: req.user._id 
    }).sort({ createdAt: -1 });

    res.json({ resignation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitExitQuestionnaire = async (req, res) => {
  try {
    const { responses } = req.body;
    console.log('User from request:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }


    const existingQuestionnaire = await ExitQuestionnaire.findOne({ employeeId: req.user.id });

    if (existingQuestionnaire) {
      return res.status(400).json({ message: 'You have already submitted the exit questionnaire.' });
    }

    
    const exitQuestionnaire = await ExitQuestionnaire.create({
      employeeId: req.user.id,
      responses
    });

    res.json({ message: 'Exit questionnaire submitted successfully' });
  } catch (error) {
    console.error('Error saving exit questionnaire:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.checkQuestionnaireStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }
    
    const existingQuestionnaire = await ExitQuestionnaire.findOne({ employeeId: req.user.id });
    
    if (existingQuestionnaire) {
      return res.json({ 
        submitted: true,
        submittedDate: existingQuestionnaire.createdAt
      });
    }
    
    return res.json({ submitted: false });
  } catch (error) {
    console.error('Error checking questionnaire status:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      read: false
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

