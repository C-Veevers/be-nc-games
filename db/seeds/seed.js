const db = require('../');
const format = require('pg-format');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data; 
  const tables = ['categories', 'users', 'reviews', 'comments']
  const drop = `DROP TABLE IF EXISTS`
  const create = `CREATE TABLE`
  const insert = `INSERT INTO`
  //dropping tables in reverse order:
  return db.query(`${drop} ${tables[3]};`)
    .then(() => {
      return db.query(`${drop} ${tables[2]};`)
    }).then(() => {
      return db.query(`${drop} ${tables[1]};`)
    }).then(() => {
      return db.query(`${drop} ${tables[0]};`)
    }).then(() => {
      //creating tables:
      return db.query(`${create} ${tables[0]}(
        slug VARCHAR PRIMARY KEY NOT NULL,
        description VARCHAR(255) NOT NULL
      );
    `)
    }).then(() => {
      return db.query(`${create} ${tables[1]}(
        username VARCHAR(60) PRIMARY KEY NOT NULL,
        avatar_url VARCHAR(255),
        name VARCHAR(255) NOT NULL
      );
    `)
    }).then(() => {
      return db.query(`${create} ${tables[2]}(
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(60) NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(255),
        review_img_url TEXT,
        votes INT DEFAULT 0,
        category VARCHAR REFERENCES categories(slug) NOT NULL,
        owner VARCHAR(60) REFERENCES users(username) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    }).then(() => {
      return db.query(`${create} ${tables[3]}(
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(60) REFERENCES users(username) NOT NULL,
        review_id INT REFERENCES reviews(review_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body TEXT        
      );
    `)
    }).then(() => {
      const catArray = categoryData.map(cat => {
        return [cat.slug, cat.description]
      })
      const catItems = format(`${insert} ${tables[0]}
    (slug, description)
    VALUES %L
    RETURNING *;`, catArray)
      return db.query(catItems)
    }).then(() => {
      const userArray = userData.map(user => {
        return [user.username, user.name, user.avatar_url]
      })
      const userItems = format(`${insert} ${tables[1]}
      (username, name, avatar_url )
      VALUES %L
      RETURNING *;`, userArray)
      return db.query(userItems)
    }).then(() => {
      const reviewArray = reviewData.map((rev, index) => {
        return [rev.title, rev.designer, rev.owner, rev.review_img_url,
        rev.review_body, rev.category, rev.created_at, rev.votes]
      })
      const reviewItems = format(`${insert} ${tables[2]}
      (title, designer, owner, review_img_url, review_body, category, created_at, votes)
      VALUES %L
      RETURNING *;`, reviewArray)
      return db.query(reviewItems)
    }).then(() => {
      const comArray = commentData.map((com, index) => {
        return [com.body, com.votes, com.author, com.review_id, com.created_at]
      })
      const comItems = format(`${insert} ${tables[3]}
      (body, votes, author, review_id, created_at)
      VALUES %L
      RETURNING *;
      `, comArray)
      return db.query(comItems)
    }).then(() => {
    })
};




module.exports = seed;
