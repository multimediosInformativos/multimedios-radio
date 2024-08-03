const pool = require('../db');

// Obtener las playlists del día actual
const getPlaylists = async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  try {
    const [results] = await pool.query('SELECT * FROM playlists WHERE date = ?', [currentDate]);
    if (results.length === 0) {
      return res.status(200).json({ message: 'Se está cargando la playlist' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las playlists
const getAllPlaylists = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM playlists ORDER BY date DESC');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva playlist
const createPlaylist = async (req, res) => {
  const { title, description, date, songs } = req.body;
  try {
    const [results] = await pool.query(
      'INSERT INTO Playlists (title, description, date, songs) VALUES (?, ?, ?, ?)',
      [title, description, date, songs]
    );
    res.status(201).json({ id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una playlist existente
const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, songs } = req.body;
  try {
    await pool.query(
      'UPDATE Playlists SET title = ?, description = ?, date = ?, songs = ? WHERE id = ?',
      [title, description, date, songs, id]
    );
    res.status(200).json({ message: 'Playlist updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Playlists WHERE id = ?', [id]);
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPlaylists, getAllPlaylists, createPlaylist, updatePlaylist, deletePlaylist };
