// controllers/transactionController.js

const Transaction = require("../model/TransactionModel");
const User = require("../model/AddUsers");

// exports.addTransaction = async (req, res) => {
//   try {
//     const { adminID, userID, addAmount, expDate } = req.body;

//     console.log(req.body, "REQ BBODY IS THERE........");

//     const newTransaction = await Transaction.create({
//       adminID,
//       userID,
//       addAmount,
//       expDate,
//     });

//     res.status(201).json(newTransaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.addTransaction = async (req, res) => {
  try {
    const { adminId, userId, addAmount, expDate } = req.body;

    

    // Generate a 6-digit random number
    const transactionId = Math.floor(100000 + Math.random() * 900000);

    // Add a new transaction
    const newTransaction = await Transaction.create({
      adminId,
      userId,
      addAmount,
      expDate,
      transactionId, // Include the generated transaction ID
    });

    // Update user's amount and expDate
    const user = await User.findOne({ where: { userId: userId } });
    if (user) {
      const updatedUser = await user.update({
        amount: parseInt(user.amount) + parseInt(addAmount),
        expDate,
      });
      console.log("User updated:", updatedUser.toJSON());
    }

    res.status(201).json({ messege: "Added Successfully", transactionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTransactionList = async (req, res) => {
  try {
    const users = await Transaction.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionforAdminID = async (req, res) => {
  try {
    const { adminID } = req.query;
    let users;

    if (adminID) {
      users = await Transaction.findAll({
        where: {
          adminId: adminID,
        },
      });
    } else {
      users = await Transaction.findAll();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { userId } = req.query;
    let users;

    if (userId) {
      users = await Transaction.findAll({
        where: {
          userId: userId,
        },
      });
    } else {
      users = await Transaction.findAll();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// exports.getTransactionID = async (req, res) => {
//   try {
//     const { userID } = req.query;
//     const transactions = await Transaction.findAll({
//       where: {
//         userId: userID,
//       },
//       attributes: ["transactionID"],
//     });

//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.deleteAllTransaction = async (req, res) => {
  try {
    await Transaction.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
