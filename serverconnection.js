const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgres://fkphepak:TZ1YjrHYVAVCYGs1R7XyieajMjFo96LQ@babar.db.elephantsql.com/fkphepak',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    const createStudentsTableQuery = `
    CREATE TABLE IF NOT EXISTS project_database (
      email VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(20) NOT NULL,
      company_name VARCHAR(10) NOT NULL
  );
  
    `;

    await pool.query(createStudentsTableQuery);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Some Error Occured:', error);
  }
}

createTables();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/fetch.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'fetch.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phonenumber, company_name } = req.body;

    const query = `
  INSERT INTO project_database (email, password, first_name, last_name, phonenumber, company_name)
  VALUES ($1::varchar(255), $2, $3, $4, $5, $6)
`;

    const values = [email, password, first_name, last_name, phonenumber, company_name];
    await pool.query(query, values);

    res.json({ success: true });
  } catch (error) {
    console.error('Error occurred while inserting html form data into user_data:', error);
    res.status(600).json({ success: false, error: 'An error occurred' });
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/fetch', async (req, res) => {
  try {
    const { email } = req.query;

    const query = 'SELECT * FROM project_database WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    const rows = result.rows;

    res.render('fetch', { results: rows });
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    res.status(500).send('An error occurred');
  }
});












const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
