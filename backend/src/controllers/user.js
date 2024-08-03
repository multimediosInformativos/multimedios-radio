const admin = require('firebase-admin');
const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await pool.query('INSERT INTO Users (email, password, name, role_id, firebase_uid) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, name, role, userRecord.uid]);

        res.status(201).send({ uid: userRecord.uid, role_id: role });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Actualizar un usuario existente
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role } = req.body;
        const updates = { email, displayName: name };

        await admin.auth().updateUser(id, updates);
        await pool.query('UPDATE Users SET email = ?, name = ?, role_id = ? WHERE firebase_uid = ?', [email, name, role, id]);

        res.status(200).send({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await admin.auth().deleteUser(id);
        await pool.query('DELETE FROM Users WHERE firebase_uid = ?', [id]);
        res.status(200).send({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
