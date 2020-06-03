import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem de Usuários');
    response.json(['Matheus', 'Dailon', 'Carlos']);
});

app.listen(3333);