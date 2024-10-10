import express from 'express';
import Repo from './utils/repository';
import path from 'path';
import { engine } from 'express-handlebars';
import { connectToDatabase } from './configDatabase';


const app = express();

await connectToDatabase

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    })
);

app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use(express.static(path.resolve('src/pubclic'))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/blogs', async (req, res) => {
    const result = await Repo.getPosts();
    res.send({
      data: result,
    });
});

app.post('/api/blogs', async (req, res) => {
    const result = await Repo.createPosts(req.body);
  
    if (result.affectedRows !== 0) {
      return res.status(201).send({
        message: 'Posts created successfully',
      });
    }
  
    res.statusCode(400).send({
      messsage: "Data can't insert into database",
    });
});

app.get('/api/blogs/:id', async (req, res) => {
    const postId = req.params.id;
    if (postId.length === 0) {
        return res.status(400).send({
            message: 'Invalid post id',
        });
    }

    try {
        const result = await Repo.getPostsById(postId);
        if (!result) {
            return res.status(404).send({
                message: 'Post not found',
            });
        }

        res.send({
            data: result,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Server Error',
        });
    }
    
});

app.listen(3000, (req, res) => {
    console.log('listening 3000');
});
