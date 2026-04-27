const { Client } = require('pg');
const client = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  database: 'projects',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL'
});
client.connect();
// First check TODO table structure
client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'TODO';", (err, res) => {
  if (err) console.error('Schema error:', err);
  else console.log('TODO columns:', JSON.stringify(res.rows));
  client.end();
});