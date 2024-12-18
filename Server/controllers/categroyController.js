import db from '../db.js'; // Import your database connection
// Get all categories for the logged-in user
export const getCategories = async (req, res) => {
    const userId = req.userId;
  try {
    const [categories] = await db.promise().query('SELECT * FROM Categories WHERE user_id = ?', [userId]);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Add a new category
export const addCategory = async (req, res) => {
    const userId = req.userId;
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    await db.promise().query(
      'INSERT INTO Categories (name, type, user_id) VALUES (?, ?, ?)',
      [name, type, userId]
    );
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category' });
  }
};

// Edit a category
export const editCategory = async (req, res) => {
    const userId = req.userId;
  const categoryId = req.params.id;
  const { name, type } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE Categories SET name = ?, type = ? WHERE id = ? AND user_id = ?',
      [name, type, categoryId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    const userId = req.userId;
  const categoryId = req.params.id;

  try {
    const [result] = await db.promise().query(
      'DELETE FROM Categories WHERE id = ? AND user_id = ?',
      [categoryId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};


