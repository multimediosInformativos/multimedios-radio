const pool = require('../db');

// Obtener todos los mensajes
const getMessages = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM chat ORDER BY timestamp DESC');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo mensaje
const createMessage = async (req, res) => {
  const { user, message, is_highlighted, timestamp } = req.body;
  try {
    const [results] = await pool.query(
      'INSERT INTO chat (user, message, is_highlighted, timestamp) VALUES (?, ?, ?, ?)',
      [user, message, is_highlighted, timestamp]
    );
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un mensaje
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM chat WHERE id = ?', [id]);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un mensaje
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { is_highlighted } = req.body;
  try {
    await pool.query(
      'UPDATE chat SET is_highlighted = ? WHERE id = ?',
      [is_highlighted, id]
    );
    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, createMessage, deleteMessage, updateMessage };
