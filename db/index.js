const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

// module.exports = {
//   client,
// }

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username 
    FROM users;
  `);

  return rows;
}

async function createUser({ 
  username, 
  password,
  name,
  location
}) {
  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const { rows: [ post ]} = await client.query(`
    INSERT INTO posts(id, authorId, title, content,) 
    VALUES($1, $2, $3, $4) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
  `, [authorId, title, content,]);

    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, {
  title,
  content,
  active
}) { 
  
  const setString = Object.keys(fields).map(
  (key, index) => `"${ key }"=$${ index + 1 }`
).join(', ');

if (setString.length === 0) {
  return;
}

  try {
  const { rows: [post] } = await client.query(`
    UPDATE post
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, Object.values(fields));

  return post;
} catch (error) {
  throw error;
}
}

async function getAllPosts() {
  
    const { rows } = await client.query(
    `SELECT authorId, title, content 
    FROM post;
  `);

  return rows;
} 

async function getPostsByUser(userId) {
  try {
    const { rows } = client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  // try {
  //   const { rows } = client.query(`
  //   SELECT 
  // if it doesn't exist, return null

  // if it does:
  // delete the 'password' key from the returned object
  // get their posts (use getPostsByUser)
  // then add the posts to the user object with key 'posts'
  // return the user object
}

// and export them
module.exports = {
  client,
  getAllUsers,
  createUser, 
  updateUser,
  // createPost,
  // updatePost,
  // getAllPosts,
  // getPostsByUser,
  // getUserById
}