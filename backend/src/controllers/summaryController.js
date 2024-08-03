const pool = require('../db');

// Obtener todos los resúmenes
const getSummaries = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Summaries');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo resumen
const createSummary = async (req, res) => {
  const { title, description, is_active } = req.body;
  try {
    const [results] = await pool.query(
      'INSERT INTO Summaries (title, description, is_active) VALUES (?, ?, ?)',
      [title, description, is_active]
    );
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un resumen existente
const updateSummary = async (req, res) => {
  const { id } = req.params;
  const { title, description, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE Summaries SET title = ?, description = ?, is_active = ? WHERE id = ?',
      [title, description, is_active, id]
    );
    res.status(200).json({ message: 'Summary updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un resumen
const deleteSummary = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Summaries WHERE id = ?', [id]);
    res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSummaries, createSummary, updateSummary, deleteSummary };
