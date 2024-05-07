import accountModel from "../model/account.model.js";
import generateRandomAccountNumber from "../helper/accnumber.js";

const accountController = {
  accCreation: async (req, res) => {
    try {
      const newAccount = await accountModel.create(req.body);
      res.status(200).json({
        success: true,
        message: "Account created successfully",
        account: newAccount,
      });
    } catch (err) {
      console.log(err);
    }
  },
  accList: async (req, res) => {
    try {
      const accounts = await accountModel.find();
      res.status(200).json({
        success: true,
        accounts,
      });
    } catch (err) {
      console.log(err);
    }
  },
  accById: async (req, res) => {
    try {
      const account = await accountModel.findById(req.params.id);
      res.status(200).json({
        success: true,
        account,
      });
    } catch (err) {
      console.log(err);
    }
  },
  updating: async (req, res) => {
    try {
      const updatedAccount = await accountModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Account updated successfully",
        account: updatedAccount,
      });
    } catch (err) {
      console.log(err);
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const deletedAccount = await accountModel.findByIdAndDelete(
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        account: deletedAccount,
      });
    } catch (err) {
      console.log(err);
    }
  },
  transferFunds : async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;

    try {
        const fromAccount = await accountModel.findById(fromAccountId);
        const toAccount = await accountModel.findById(toAccountId);

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (fromAccount.amount < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Perform the transfer
        fromAccount.amount -= amount;
        toAccount.amount += amount;

        await fromAccount.save();
        await toAccount.save();

        res.status(200).json({ message: 'Funds transferred successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
},
depositFunds : async (req, res) => {
  const { accountId, amount } = req.body;

  try {
      // Find the account by ID
      const account = await accountModel.findById(accountId);

      if (!account) {
          return res.status(404).json({ message: 'Account not found' });
      }

      // Update the account's amount by adding the deposited amount
      account.amount += amount;

      // Save the updated account document back to the database
      const updatedAccount = await account.save();

      // Respond with a success message and the updated account details
      res.status(200).json({
          message: 'Funds deposited successfully',
          updatedAccount: updatedAccount
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
},

 withdrawFunds : async (req, res) => {
  const { accountId, amount } = req.body;

  try {
      // Find the account by ID
      const account = await accountModel.findById(accountId);

      // If account not found, return 404
      if (!account) {
          return res.status(404).json({ message: 'Account not found' });
      }

      // Check if the account balance is sufficient for the withdrawal
      if (account.balance < amount) {
          return res.status(400).json({ message: 'Insufficient funds' });
      }

      // Perform the withdrawal by subtracting the amount from the account's balance
      account.balance -= amount;

      // Save the updated account back to the database
      const updatedAccount = await account.save();

      // Respond with success message and updated account details
      return res.status(200).json({
          message: 'Funds withdrawn successfully',
          updatedAccount: updatedAccount
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}



};
export default accountController;