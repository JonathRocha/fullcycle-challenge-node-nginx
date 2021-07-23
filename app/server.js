const express = require('express');
const knex = require('knex');
const faker = require('faker');
const app = express();
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'db',
    port: 3306,
    user: 'root',
    password: 'secret',
    database: 'nodedb',
  },
});

async function insertUserAndReturnList() {
  try {
    await db('people').insert({
      name: faker.name.findName(),
    });
    const users = await db.from('people').select('*').limit(100);
    return users;
  } catch (error) {
    console.error({ message: error.message });
    return null;
  }
}

app.get('/', (_, res) => {
  insertUserAndReturnList().then((users) => {
    if (!users || !users.length) {
      res.send(`
        <h1>Full Cycle Rocks!<h1>
        <h3>There isn't any user to list :(</h3>
      `);
      return;
    }

    res.send(`
      <h1>Full Cycle Rocks!<h1>
      <h3>Users:</h3>
      <ul>
          ${users.map((user) => `<li>${user.id} - ${user.name}</li>`).join(' ')}
      </ul>
    `);
  });
});

app.listen(3000, () => {
  console.info(`Server is running on port 3000`);
});
