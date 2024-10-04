const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    projectId: String,
    CSB01: {
        roomExam: String,
        dateExam: Date,
        referee: [{
            keyTeacher: String,
            score: Number,
        }],
        limitReferee: Number,
        totalScore: Number,
        limitScore: Number,
        activeStatus: Number,
        resultStatus: Number,
    },
    CSB02: {
        roomExam: String,
        dateExam: Date,
        referee: [{
            keyTeacher: String,
            score: Number,
        }],
        limitReferee: Number,
        totalScore: Number,
        limitScore: Number,
        activeStatus: Number,
        resultStatus: Number,
    },
    CSB03: {
        student: [{
            studentId: String,
        }],
        start_in_date: Date,
        end_in_date: Date,
        referee: [{
            keyTeacher: String,
            status: Number,
        }],
        activeStatus: Number,
        resultStatus: Number,
    },
    CSB04: {
        roomExam: String,
        dateExam: Date,
        referee: [{
            keyTeacher: String,
            score: Number,
        }],
        limitReferee: Number,
        totalScore: Number,
        limitScore: Number,
        activeStatus: Number,
        resultStatus: Number,
    },
});

module.exports = mongoose.model('Score', scoreSchema);