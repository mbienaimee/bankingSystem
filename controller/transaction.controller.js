import { updateUserBalance } from './userController.js'; // Assuming userController has methods to update user balances

// Controller for deposit transaction
export const performDeposit = (req, res) => {
  const { accountId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
  }

  updateUserBalance(accountId, amount, 'deposit')
    .then(updatedBalance => {
      res.status(200).json({ success: true, message: 'Deposit successful', balance: updatedBalance });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: 'Failed to process deposit', error: error.message });
    });
};

// Controller for withdrawal transaction
export const performWithdrawal = (req, res) => {
  const { accountId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
  }

  updateUserBalance(accountId, amount, 'withdrawal')
    .then(updatedBalance => {
      res.status(200).json({ success: true, message: 'Withdrawal successful', balance: updatedBalance });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: 'Failed to process withdrawal', error: error.message });
    });
};

// Controller for transfer transaction
export const performTransfer = (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid transfer amount' });
  }

  // Simulate transfer by updating balances for both accounts
  Promise.all([
    updateUserBalance(fromAccountId, amount, 'withdrawal'),
    updateUserBalance(toAccountId, amount, 'deposit')
  ])
    .then(([fromBalance, toBalance]) => {
      res.status(200).json({ success: true, message: 'Transfer successful', fromBalance, toBalance });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: 'Failed to process transfer', error: error.message });
    });
};
