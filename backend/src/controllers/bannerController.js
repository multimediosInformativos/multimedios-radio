const pool = require('../db');

// Obtener todos los banners
const getBanners = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Banners');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo banner
const createBanner = async (req, res) => {
  const { title, description, image_url, is_active, see_text } = req.body;

  console.log('Received data for creating banner:', { title, description, is_active, see_text, image_url });

  try {
    const [results] = await pool.query(
      'INSERT INTO Banners (title, description, image_url, is_active, see_text) VALUES (?, ?, ?, ?, ?)',
      [title, description, image_url, is_active, see_text]
    );
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un banner existente
const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, is_active, see_text } = req.body;

  console.log('Received data for updating banner:', { id, title, description, is_active, see_text, image_url });

  try {
    await pool.query(
      'UPDATE Banners SET title = ?, description = ?, image_url = ?, is_active = ?, see_text=? WHERE id = ?',
      [title, description, image_url, is_active, see_text, id]
    );
    res.status(200).json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un banner
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Banners WHERE id = ?', [id]);
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
