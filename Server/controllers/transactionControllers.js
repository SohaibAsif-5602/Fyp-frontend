import db from '../dbpool.js';

export const addTransaction = async (req, res) => {
  const userId = req.userId; // Extracted from verifyToken middleware
  const { transaction_type, amount, transaction_date, receipt_no, pond_id, transaction_details, category_id } = req.body;

  try {
    const sql = `
      INSERT INTO Transactions (transaction_type, amount, transaction_date, receipt_no, pond_id, user_id, transaction_details, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      transaction_type,
      amount,
      transaction_date,
      receipt_no || null,
      pond_id,
      userId, // Set user_id from token
      transaction_details || null,
      category_id || null,
    ]);

    res.status(201).json({ message: 'Transaction added successfully', transaction_id: result.insertId });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};



export const updateTransaction = async (req, res) => {
  const userId = req.userId; // Extracted from verifyToken middleware
  const { transaction_id } = req.params;
  const { transaction_type, amount, transaction_date, receipt_no, pond_id, transaction_details, category_id } = req.body;

  try {
    const sql = `
      UPDATE Transactions
      SET transaction_type = ?, amount = ?, transaction_date = ?, receipt_no = ?, pond_id = ?, transaction_details = ?, category_id = ?
      WHERE transaction_id = ? AND user_id = ?
    `;
    const [result] = await db.execute(sql, [
      transaction_type,
      amount,
      transaction_date,
      receipt_no || null,
      pond_id,
      transaction_details || null,
      category_id || null,
      transaction_id,
      userId, // Ensure user can only update their own transactions
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
};



export const getTransactions = async (req, res) => {
    const userId = req.userId; 
  
    try {
      const sql = `
        SELECT 
          T.transaction_id,
          T.transaction_type,
          T.amount,
          T.transaction_date,
          T.receipt_no,
          T.pond_id,
          T.transaction_details,
          T.category_id,
          C.name AS category_name,
          C.type AS category_type
        FROM Transactions T
        LEFT JOIN Categories C ON T.category_id = C.id
        WHERE T.user_id = ?
      `;
      const [rows] = await db.execute(sql, [userId]);
  
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
  };
    


  export const getCategories = async (req, res) => {
    const userId = req.userId; // Extracted from verifyToken middleware
  
    try {
      const sql = `
        SELECT 
          id, 
          name, 
          type
        FROM Categories
        WHERE user_id = ?
      `;
      const [rows] = await db.execute(sql, [userId]);
  
      res.status(200).json(rows); // Return the categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  };