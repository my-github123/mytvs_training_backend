const jwt = require("jsonwebtoken");
const User = require("../model/User");
const getUsers = require("../model/AddUsers");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, address, userId } = req.body;
    console.log(req.body, "BODY IS THERE....");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    const getUser = await getUsers.findOne({ where: { username } });

    let authenticatedUser;

    if (user && user.password === password) {
      authenticatedUser = user;
    } else if (getUser && getUser.password === password) {
      authenticatedUser = getUser;
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: authenticatedUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1000y",
      }
    );

    console.log("Login successful");

    res.json({
      message: "Login successful",
      token,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error("Error from userController:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// exports.loginUser = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { username, password } = req.body;

//     const user = await User.findOne({ where: { username } });
//     const getUser = await getUsers.findOne({ where: { username } });

//     console.log(user.fromApp, "sdsds", user.role, "aas");

//     let authenticatedUser;

//     // if (user.fromApp === "Training portals" && user.role !== "admin") {
//     //   console.log("User is not allowed to login");
//     //   return res.status(403).json({ error: "User not authorized to login" });
//     // }

//     if (user && user.password === password) {
//       authenticatedUser = user;
//     } else if (getUser && getUser.password === password) {
//       authenticatedUser = getUser;
//     } else {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const token = jwt.sign(
//       { userId: authenticatedUser.id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1000y",
//       }
//     );

//     console.log("Login successful");

//     res.json({ message: "Login successful", token, user: authenticatedUser });
//   } catch (error) {
//     console.error("Error from userController:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    console.log(userId, "usernid j s ");

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUsernames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["username"] });

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    const usernames = users.map((user) => user.username);
    res.json(usernames);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user; // Retrieved from the JWT verification middleware
    const updates = req.body;

    // If the request includes a password, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "country",
    ];
    const isValidUpdate = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ error: "Invalid update fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user; // Retrieved from the JWT verification middleware

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGarageDetails = async (req, res) => {
  const { garageType } = req.body;

  try {
    let whereCondition = {
      role: {
        [Sequelize.Op.not]: "Admin",
      },
    };

    if (garageType !== "all") {
      whereCondition.garageType = garageType;
    }

    const garages = await User.findAll({
      where: whereCondition,
      // attributes: ["garageName", "garageId", "userId"],
      group: ["garageName"],
    });

    res.json(garages);
  } catch (error) {
    console.error("Error executing Sequelize query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// exports.mapVideoToGarage = async (req, res) => {
//   try {
//     const { selectedGarages, selectedVideos } = req.body;

//     // Iterate over each selected video URL
//     for (const videoUrl of selectedVideos) {
//       // Iterate over each selected garage
//       for (const userId of selectedGarages) {
//         // Update the videoUrl for the selected garage
//         await User.update({ videoUrl }, { where: { userId } });
//       }
//     }

//     res.status(200).json({ message: 'Videos mapped to garages successfully' });
//   } catch (error) {
//     console.error('Error mapping videos to garages:', error);
//     res.status(500).json({ error: 'An error occurred while mapping videos to garages' });
//   }
// };

exports.loginUserByRole = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username,
        role: "Admin",
      },
    });

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ error: "Invalid username or password from user" });
    }

    const passwordMatch = user.password === password;

    console.log(
      username,
      user.password,
      password,
      "PASSWORD IS THERE.............."
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid username or password from password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1000y",
    });
    console.log("Login successful");

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error from userContoller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
