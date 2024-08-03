const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset, updateEmail, sendEmailVerification, updateProfile, verifyPasswordResetCode } = require('firebase/auth');
const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });

        // Save user data to the database
        const [result] = await pool.query('INSERT INTO Users (email, password, name, role_id, firebase_uid) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, name, role, user.uid]);

        res.status(201).send({ uid: user.uid, role_id: role });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(400).send({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send({ error: 'Contraseña incorrecta' });
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        res.status(200).send({ uid: firebaseUser.uid, displayName: user.name, role_id: user.role_id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(auth, email);
        res.status(200).send({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { oobCode, newPassword } = req.body;

        // Verify the reset code and get the email associated with it
        const email = await verifyPasswordResetCode(auth, oobCode);

        // Confirm the password reset
        await confirmPasswordReset(auth, oobCode, newPassword);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password in the MySQL database
        await pool.query('UPDATE Users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.status(200).send({ message: 'Contraseña restablecida' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const user = auth.currentUser;
        if (user) {
            await updateEmail(user, newEmail);

            // Update user email in the database
            await pool.query('UPDATE Users SET email = ? WHERE firebase_uid = ?', [newEmail, user.uid]);

            res.status(200).send({ message: 'Correo electrónico actualizado' });
        } else {
            res.status(401).send({ error: 'Usuario no autenticado' });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await sendEmailVerification(user);
            res.status(200).send({ message: 'Correo de verificación enviado' });
        } else {
            res.status(401).send({ error: 'Usuario no autenticado' });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { email, displayName, uid } = req.body;

        // Verifica si el usuario ya existe en la base de datos
        const [rows] = await pool.query('SELECT * FROM Users WHERE firebase_uid = ?', [uid]);

        if (rows.length === 0) {
            // Si el usuario no existe, lo insertamos en la base de datos con el rol 8
            await pool.query('INSERT INTO Users (email, name, role_id, firebase_uid) VALUES (?, ?, ?, ?)', [email, displayName, 8, uid]);
        }

        // Obtener el rol del usuario
        const [user] = await pool.query('SELECT role_id FROM Users WHERE firebase_uid = ?', [uid]);

        res.status(200).send({ uid: uid, displayName: displayName, role_id: user[0].role_id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = { register, login, forgotPassword, resetPassword, changeEmail, verifyEmail, googleLogin };
