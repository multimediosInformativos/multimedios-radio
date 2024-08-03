const pool = require('../db');

// Obtener todos los anuncios
const getAnnouncements = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Announcements');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo anuncio
const createAnnouncement = async (req, res) => {
  const { title, description, image_url, is_active, see_text } = req.body;
  try {
    const [results] = await pool.query(
      'INSERT INTO Announcements (title, description, image_url, is_active, see_text) VALUES (?, ?, ?, ?, ?)',
      [title, description, image_url, is_active, see_text]
    );
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un anuncio existente
const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, is_active, see_text } = req.body;
  try {
    await pool.query(
      'UPDATE Announcements SET title = ?, description = ?, image_url = ?, is_active = ?, see_text=? WHERE id = ?',
      [title, description, image_url, is_active, see_text, id]
    );
    res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un anuncio
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Announcements WHERE id = ?', [id]);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
