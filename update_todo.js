const { Client } = require('pg');
const client = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  database: 'projects',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL'
});
client.connect();
client.query("UPDATE TODO SET status='done', completed_at=NOW() WHERE id=85 RETURNING id, status, task;", (err, res) => {
  if (err) console.error(err);
  else console.log(JSON.stringify(res.rows));
  client.end();
});