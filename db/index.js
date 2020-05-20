const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

// module.exports = {
//   client,
// }

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

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username 
    FROM users;
  `);

  return rows;
}

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const { rows: [ post ]} = await client.query(`
    INSERT INTO posts("authorId", title, content) 
    VALUES($1, $2, $3 ) 
    RETURNING *;
  `, [authorId, title, content ]);

    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) { 
  
  const setString = Object.keys(fields).map(
  (key, index) => `"${ key }"=$${ index + 1 }`
).join(', ');

  try { 
    if (setString.length > 0) {
     await client.query(`
    UPDATE posts
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, Object.values(fields));
    }
    
  return await getPostById(id);
} catch (error) {
  throw error;
}
}

async function getAllPosts() {
  try{
    const { rows: postIds } = await client.query(
    `SELECT id 
    FROM posts;
  `);

  const posts = await Promise.all(postIds.map(
    post => getPostById( post.id )
  ));

  return posts;
} catch (error) {
  throw error;
}
}

async function getPostById(postId) {
  try {
    const { rows: [ post ]  } = await client.query(`
      SELECT *
      FROM posts
      WHERE id=$1;
    `, [postId]);

    // const { rows: tags } = await client.query(`
    //   SELECT tags.*
    //   FROM tags
    //   JOIN post_tags ON tags.id=post_tags."tagId"
    //   WHERE post_tags."postId"=$1;
    // `, [postId])

    const { rows: [author] } = await client.query(`
      SELECT id, username, name, location
      FROM users
      WHERE id=$1;
    `, [post.authorId])

    // post.tags = tags;
    post.author = author;

    delete post.authorId;

    return post;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
    try {
    const { rows } = await client.query(`
    SELECT * FROM users WHERE id = $1; ` , [userId]);
    // if it doesn't exist, return null
    if (!rows||!rows.length) {return null};
    // if it does:
    // delete the 'password' key from the returned object
    const [ user ]  = rows;
    delete user.password;
    // get their posts (use getPostsByUser)
    user.posts = await getPostsByUser(userId);
    // then add the posts to the user object with key 'posts'
    // return the user object
    return user;
  console.log('>>>>>>>' , user)
  } catch(error){
    console.error(error)
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// and export them
module.exports = {
  client,
  getAllUsers,
  createUser, 
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById
}