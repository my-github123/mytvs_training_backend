const Transaction = require("../model/TransactionModel");
const DebitList = require("../model/debitModel");
const GetUsers = require("../model/AddUsers");

exports.getTransactionData = async (req, res) => {
  try {
    const { adminId, userId } = req.query;

    // Validate adminID and userID
    if (isNaN(adminId) || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid adminID or userID" });
    }

    // Fetch data from both models
    const transactions = await Transaction.findAll({
      where: { adminId, userId },
    });

    const userDetails = await GetUsers.findOne({
      where: { adminId, userId },
      attributes: ["amount", "expDate"], // Specify the fields you want to fetch
    });

    const debits = await DebitList.findAll({ where: { adminId, userId } });

    // Format response
    const response = {
      userDetails,
      credit: transactions,
      debit: debits,
    };

    res.json(response);
  } catch (error) {
    console.error("Error from getTransactionData controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
