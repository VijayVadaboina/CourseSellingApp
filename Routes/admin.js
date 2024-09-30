const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const { adminMiddleware } = require("../middleware/admin");
const { adminModel, courseModel } = require("../server/db");
const { JWT_ADMIN_PASSWORD } = require("../config");

const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
  try {
    // const email = req.body.email;
    // const password = req.body.password;
    // const FirstName = req.body.FirstName;
    // const LastName = req.body.Lastname;
    const { email, password, FirstName, LastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email: email,
      password: hashedPassword,
      FirstName: FirstName,
      LastName: LastName,
    });
    // console.log(JSON.stringify(test));
    res.send({
      message: "signed up successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: " error while signing up",
    });
  }
});

adminRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log("Incoming email:", email);
    console.log("Incoming passwerd:", password);

    const adminUser = await adminModel.findOne({
      email: email,
    });
    if (!adminUser) {
      console.log(" no email is found ");
    }
    //console.log(JSON.stringify(adminUser));
    //console.log(email, password);
    //console.log("hashedpwd: " + adminUser.password);
    //console.log("JWTADMIN: " + JWT_ADMIN_PASSWORD);
    const passwordMatch = await bcrypt.compare(password, adminUser.password);
    if (adminUser && passwordMatch) {
      const token = jwt.sign(
        {
          id: adminUser._id.toString(),
        },
        JWT_ADMIN_PASSWORD
      );
      res.send({
        message: "signed in successfully",
        token: token,
      });
    } else {
      res.status(403).send({
        message: "Invalid credentials",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: " error while signing in",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: adminId,
    });
    res.json({
      message: "Course added successfully",
      course: course._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "unable to create a course",
    });
  }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );
  res.json({
    message: "course updated successfully",
    course: course._id,
  });
});

adminRouter.get("/courses", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const courses = await courseModel.find({
    creatorId: adminId,
  });
  res.json({
    message: "fetched all the courses",
    courses,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
