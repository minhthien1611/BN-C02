import { connectToDatabase } from '../configDatabase.js';

// Connect to database
const db = await connectToDatabase();

class Repository {
  constructor() {
    this.db = db;
  }

  async getPosts() {
    const [result] = await this.db.query('SELECT * FROM blogs');
    return result;
  }

  async createPosts(body) {
    const { title, description, author, image, createDate } = body;

    const [result] = await db.query(
      'INSERT INTO `blogs` (`title`, `description`, `author`, `image`, `createDate`) VALUES(?, ?, ?, ?, ?)',
      [
        title,
        description,
        author,
        image,
        createDate 
      ]
    );
    return result;
  }

  async getPostsById(id) {
    const [result] = await this.db.query('SELECT * FROM blogs WHERE id =?', [
      id,
    ]);
    return result[0];
  }

}

export default new Repository();