const mongoose = require('mongoose');

const exitQuestionnaireSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    questionText: String,
    response: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExitQuestionnaire', exitQuestionnaireSchema);