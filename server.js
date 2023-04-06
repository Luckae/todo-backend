
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const sequelize = new Sequelize('robialih_appAcademy', 'robialih_lawson', 'Yb~Zcn,0R(ch', {
  host: 'localhost',
  dialect: 'mysql'
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

app.get('/todoApp/tasks/', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.post('/todoApp/tasks/', async (req, res) => {
    
    const task = {
    title: req.body.title,
    completed: req.body.completed ? req.body.completed : false
  };
    
    Task.create(task)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Task."
      });
    });
    
//   const task = await Task.create({
//     title: req.body.title,
//     // description: req.body.description,
//     completed: false
//   });
//   res.json(task);
});

app.put('/todoApp/tasks/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.title = req.body.title;
  task.description = req.body.description;
  task.completed =  true;
  await task.save();
  res.json(task);
});

app.delete('/todoApp/tasks/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  await task.destroy();
  res.json({ message: 'Task deleted' });
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});

