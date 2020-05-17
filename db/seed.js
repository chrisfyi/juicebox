
const { 
  // other imports,
  client,
  getAllUsers,
  createUser,
  updateUser,
  user
} = require('./index');

// new function, should attempt to create a few users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Albert' , location: 'Wichita' });

    const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra' , location: 'Huntington Beach' });

    const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Sarah' , location: 'Hollywood' });

    console.log(albert,sandra,glamgal);

    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}

// then modify rebuildDB to call our new function
async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    // await createTablesPosts();
  } catch (error) {
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL, 
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createTablesPosts(){
  try {
    console.log("Starting to build post tables...");

    await client.query(`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
    "authorId" INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    active BOOLEAN DEFAULT true
    );
    `)
  

  console.log("Finished building posts tables!");
} catch (error) {
  console.error("Error building posts tables!");
  throw error
}
}


async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers")
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());