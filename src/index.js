//dependencies
const {v4: uuid ,validate} = require('uuid');
const cors = require('cors');
const express = require('express');

//initialize server
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//middlewares functions
const isValidId = (request, response, next) => {
    const { id } = request.params;
    if(id && validate(id)){
        next();
        return;
    }
    return response.status(400).json({message: "Invalid course id!"});
};

const courses = [];
const isExistsCourse = (request, response, next) => {
    const {id} = request.params;

    const index = courses.findIndex(c => c.id === id);
    if(index < 0) {
        return response.status(400).json({message: 'Course not found'});
    }

    request.index = index;
    next();
}

//Routes
app.get('/', (_, response) => {
    return response.json({message: "Hey Ignite!!! o/."})
});

app.get('/courses', (_, response) => response.json(courses));

app.post('/courses', (request, response) => {
    const { name, author } = request.body;
    const course = {
        id: uuid(),
        name, 
        author
    };
    courses.push(course);
    return response.json(course);
});

//***other ways to use middleware
app.use(isExistsCourse);

app.get('/courses/:id', isValidId, (request, response) => {
    return response.json(courses[request.index]);
});

app.put('/courses/:id', isValidId, (request, response) => {
    const { id } = request.params;
    const { name, author } = request.body;
    const index = request.index;
    
    courses[index] = {id, name, author};
    
    return response.json(courses[index]);
});

app.patch('/courses/:id', isValidId, (request, response) => {
    const { name, author } = request.body;
    const index = request.index;

    if(!name && !author) {
        return response.status(400).json({message: 'Name or Author is required!'});
    }

    if(name) courses[index].name = name;
    if(name) courses[index].author = author;

    return response.json(courses[index]);
});

app.delete('/courses/:id', isValidId, (request, response) => {
    courses.splice(request.index, 1);

    return response.status(204).send();
});

//starting server
app.listen(3333, () => console.log('Ignite started with nodemon'));