require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const auth = require("./middleware/auth");
const multer = require("multer");
const bodyParser = require("body-parser");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Score = require("./model/score.model");
const Project = require("./model/project.model");
const User = require("./model/user.model");
const Room = require("./model/room.model");

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

app.use(express.json());

app.post("/create-form", async (req, res) => {
  const {
    projectName,
    projectType,
    projectStatus,
    projectDescription,
    student,
    lecturer,
  } = req.body;
  // status
  // 0: Not yet
  // 1: Done
  // 2: Cancel

  const projects = await Project.create({
    projectName,
    projectType,
    projectStatus,
    projectDescription,
    student,
    lecturer,
    scoreId: "",
  });

  const scores = await Score.create({
    projectId: projects._id,
    CSB01: {
      roomExam: "",
      dateExam: "",
      referee: [],
      limitReferee: 0,
      totalScore: 0,
      limitScore: 0,
      activeStatus: 0,
      resultStatus: 0,
    },
    CSB02: {
      score: 0,
      status: "",
      referee: [],
      limitReferee: 0,
      totalScore: 0,
      limitScore: 0,
      activeStatus: 0,
      resultStatus: 0,
    },
    CSB03: {
      student: [
        {
          studentId: "",
        },
      ],
      start_in_date: "",
      end_in_date: "",
      referee: [
        {
          keyTeacher: "",
          status: 0,
        },
      ],
      activeStatus: 0,
      resultStatus: 0,
    },
    CSB04: {
      score: 0,
      status: "",
      referee: [],
      limitReferee: 0,
      totalScore: 0,
      limitScore: 0,
      activeStatus: 0,
      resultStatus: 0,
    },
  });

  await Project.findByIdAndUpdate(projects._id, { scoreId: scores._id });

  res.json({ body: { score: scores, project: projects } });
});

app.post("/create-user", async (req, res) => {
  const { username, displayname, firstname, lastname, account_type } = req.body;
  console.log(req.body);
  const user = await User.create({
    username,
    displayname,
    firstname,
    lastname,
    account_type,
  });

  res.json({ body: user });
});

app.get("/", async (req, res) => {
  let score = await Score.find();
  res.json({ body: 'hello world' });
});

app.get("/exam-management", async (req, res) => {
  let score = await Score.find();
  res.json({ body: score });
});

app.get("/project-students", async (req, res) => {
  let project = await Project.find();
  res.json({ body: project });
});

app.post("/create-room-management", async (req, res) => {
  try {
    const { roomExam, nameExam, dateExam, referees, projects } = req.body;
    const room = await Room.create({
      roomExam,
      nameExam,
      dateExam,
      referees,
      projects,
    });

    
    for (const project of projects) {
      const { projectId } = project;
      const scoreUpdate = {
        roomExam,
        dateExam,
        referee: referees.map(({ keyLecturer, nameLecturer, roleLecturer }) => ({
          keyLecturer,
          nameLecturer,
          roleLecturer,
          score: 0, 
        })),
        limitReferee: referees.length,
        totalScore: 0,  
        limitScore: 100, 
        activeStatus: 1,  
        resultStatus: 0, 
      };
      const examField = `CSB${nameExam.split("CSB")[1]}`; 
      await Score.findOneAndUpdate(
        { projectId },
        {
          $set: {
            [`${examField}.roomExam`]: scoreUpdate.roomExam,
            [`${examField}.dateExam`]: scoreUpdate.dateExam,
            [`${examField}.referee`]: scoreUpdate.referee,
            [`${examField}.limitReferee`]: scoreUpdate.limitReferee,
            [`${examField}.totalScore`]: scoreUpdate.totalScore,
            [`${examField}.limitScore`]: scoreUpdate.limitScore,
            [`${examField}.activeStatus`]: scoreUpdate.activeStatus,
            [`${examField}.resultStatus`]: scoreUpdate.resultStatus,
          },
        },
        { new: true, upsert: true } 
      );
    }
    res.json({ message: "Room management and score updated successfully!" });
  } catch (error) {
    console.error("Error in creating room management:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
