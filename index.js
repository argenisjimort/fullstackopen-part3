const { response, request } = require('express');

const express = require('express');
const app = express();
app.use(express.json());

const morgan = require(`morgan`);
morgan.token(`postContent`, (req, res) => {
  if(req.method === `POST`) return JSON.stringify(req.body) 
} )
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :postContent`));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get(`/api/persons`, (request, response) => {
    response.json(persons);
} );

app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  const person = persons.find( person => person.id === id );  
  if (person) response.json(person);
  else response.status(404).end(`NOT_FOUND`);
} );

app.get(`/info`, (request, response) => {
    response.send(`PhoneBook has info for ${persons.length} Persons </br> ${new Date().toString()}`);
} );







app.post(`/api/persons/`, (request, response) => {
  const newPerson = request.body;


  if(!newPerson) return response.status(400).json({ error: `content missing` });
  if(!newPerson.name || !newPerson.number) return response.status(400).json({ error: `missing information` });
  if(persons.filter( person => person.name.toUpperCase() === newPerson.name.toUpperCase() ).length > 0) return response.status(400).json({ error: `name must be unique` });

  newPerson.id = Math.floor(Math.random()*1000).toString();
  persons = persons.concat(newPerson);
  response.json( newPerson );
} );








app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  persons = persons.filter( person => person.id !== id );
  response.status(204).end(`NO_CONTENT`);
} );







app.listen( 3001, () => {
    console.log(`server running :D`);
} )