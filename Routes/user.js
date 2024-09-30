const { Router } = require("express");
const jwt = require("jsonwebtoken");

const { userModel, purchaseModel, courseModel } = require("../server/db");
const { userMiddleware } = require("../middleware/user");
const { JWT_USER_PASSWORD } = require("../config");
const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const { email, password, FirstName, LastName } = req.body;
  try {
    await userModel.create({
      email: email,
      password: password,
      firstName: FirstName,
      lastName: LastName,
    });
    res.json({
      message: " signed up successfully",
    });
  } catch (e) {
    res.status(500).send({
      message: " an error occured while creating the user",
    });
  }
});
userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email,
    password: password,
  });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    // Do cookie logic

    res.json({
      message: " signed in successfully",
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});
userRouter.post("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;
  await purchaseModel.find({
    userId,
  });
  let purchasedCourseIds = [];
  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }
  const coursesData = await courseModel.find({
    _id: { $in: purchases.map((x) => x.courseId) },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};
