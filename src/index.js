const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const { request } = require("express");

const app = express();

app.use(express.json());

const users = [];

function validateUserId(request, response, next) {
    const { id } = request.params;

    if(!isUuid(id)) {
        return response
            .status(400)
            .json({ error: "Param sent is not a valid UUID" });
    }
    next();
}

app.use('/users/:id', validateUserId);

app.post('/users', (request, response) => {
    const { name, lastName, age, company, technologies } = request.body;

    const user = { 
        id: uuid(), 
        name, 
        lastName, 
        company, 
        technologies 
    };
    users.push(user);

    return response.json(user);
});

app.get('/users', (request, response) => {
    const { name } = request.query;

    const results = name 
        ? users.filter(user => 
            user.name.toLowerCase().includes(name.toLowerCase()))
        : users;
        
        return response.json(results);
});

app.put('/users/:id', (request, response) => {
    const { id } = request.params;
    const { name, lastName, age, company, technologies } = request.body;

    const userIndex = users.findIndex(user => user.id == id);

    if(userIndex < 0) {
        return response.status(400).json({ error: "User not found" });
    }

    const user = { 
        id: uuid(), 
        name, 
        lastName, 
        company, 
        technologies 
    };

    users[userIndex] = user;

    return response.json(user);
});

app.delete('/users/:id', (request, response) => {
    const { id } = request.params;

    const userIndex = users.findIndex(user => user.id == id);

    if(userIndex < 0) {
        return response.status(400).json({ error: "User not found" });
    }
    
    users.splice(userIndex, 1);

    return response.status(204).send();
}); 

const port = 3333;
app.listen(port, () => {
    console.log(`Server up nd running on PORT ${port}`);
});