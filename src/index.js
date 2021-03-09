//dependencies
const { request, response } = require('express');
const {v4: uuid ,validate} = require('uuid');
const cors = require('cors');
const express = require('express');

//construction server
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//functions middlewares
const validateId = (request, response, next) => {
    const { id } = request.params;
    if(id && validate(id)){
        next();
        return;
    }
    return response.status(400).json({message: "Invalid course id!"});
};

const courses = [];
const checkedExistsCourse = (request, response, next) => {
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

//***Other middleware
app.use(checkedExistsCourse);

app.get('/courses/:id', validateId, (request, response) => {
    return response.json(courses[request.index]);
});

app.put('/courses/:id', validateId, (request, response) => {
    const { id } = request.params;
    const { name, author } = request.body;
    const index = request.index;
    
    courses[index] = {id, name, author};
    
    return response.json(courses[index]);
});

app.patch('/courses/:id', validateId, (request, response) => {
    const { name, author } = request.body;
    const index = request.index;

    if(!name && !author) {
        return response.status(400).json({message: 'Name or Author is required!'});
    }

    if(name) courses[index].name = name;
    if(name) courses[index].author = author;

    return response.json(courses[index]);
});

app.delete('/courses/:id', validateId, (request, response) => {
    courses.splice(request.index, 1);

    return response.status(204).send();
});

//starting server
app.listen(3333, () => console.log('Ignite started with nodemon'));