import express from 'express';

const app = express();

const users = ['Matheus', 'Dailon', 'Carlos'];
app.get('/users', (request, response) => {
    const search = request.query.search;

    return response.json(users);
});

app.post('/users', (request, response) => {
    const user = {
        nome: 'Matheus',
        email: 'matheus.franca@alterdata.com.br'
    };

    return response.json(user);
});

app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

app.listen(3333);