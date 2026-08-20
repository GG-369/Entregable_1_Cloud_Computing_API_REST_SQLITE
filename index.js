const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware para procesar JSON nativo
app.use(express.json());

// Crear o conectar a la base de datos
const db = new sqlite3.Database('./students.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT,
    lastname TEXT,
    gender TEXT,
    age INTEGER
)`);

// Rutas de la API

// GET: Leer todos los estudiantes
app.get('/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST: Crear un estudiante
app.post('/students', (req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    db.run(`INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`, 
        [firstname, lastname, gender, age], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `1 Student with id: ${this.lastID} created successfully` });
    });
});

// GET: Leer 1 estudiante
app.get('/student/:id', (req, res) => {
    db.get("SELECT * FROM students WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});

// PUT: Modificar 1 estudiante
app.put('/student/:id', (req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    db.run(`UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`,
        [firstname, lastname, gender, age, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Student with id: ${req.params.id} updated successfully` });
        });
});

// DELETE: Eliminar estudiante
app.delete('/student/:id', (req, res) => {
    db.run("DELETE FROM students WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `The Student with id: ${req.params.id} has been deleted.` });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`API Node.js ejecutándose en el puerto ${port}`);
});
