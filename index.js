const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ToDoTask = require('./models/ToDoTask');

const app = express();
dotenv.config();

app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to DB!');
    app.listen(3000, () => console.log('Server Up and Running'))
});

app.get('/', (req, res) => {
    ToDoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks })
    })
});

app.post('/', async(req, res) => {
    const todoTask = new ToDoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

app.route('/edit/:id').get((req, res)=> {
    const id = req.params.id;
    ToDoTask.find({}, (err, tasks)=> {
        res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
    })
}).post((req, res) => {
    const id = req.params.id;
    ToDoTask.findByIdAndUpdate(id, { content: req.body.content }, err =>{
        if (err) return res.send(500, err);
        res.redirect('/');
    });
});

app.route('/remove/:id').get((req, res)=> {
    const id = req.params.id;
    ToDoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect('/');
    });
});