const { Client } = require('pg');
const client = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  database: 'projects',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL'
});
client.connect();
client.query("SELECT id, name, discord_channel_id, discord_dev_channel_id, discord_social_channel_id FROM Projects WHERE id=16;", (err, res) => {
  if (err) console.error(err);
  else console.log(JSON.stringify(res.rows, null, 2));
  client.end();
});