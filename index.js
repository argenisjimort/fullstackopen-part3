require(`dotenv`).config()
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(`dist`))

//REQUESTLOGGER
const morgan = require(`morgan`)
morgan.token(`postContent`, (req) => {
  if(req.method === `POST` || req.method === `PUT`) return JSON.stringify(req.body)
} )
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :postContent`))


const unknownEndpoint = (request, response) => response.status(404).send({ error: `UnknownEndpoint` })

const errorHandler = (error, request, response, next) => {
  if(error.name === `CastError` ) return response.status(400).send({ error: `malformated id` })
  if(error.name === `ValidationError`) return response.status(400).send({ error: error.message })
  next(error)
}


const Person = require(`./models/person`)
const PORT = process.env.PORT || 3001





app.get(`/api/persons`, (request, response) => {
  Person.find({}).then( res => {
    response.json(res)
  })
} )

app.get(`/api/persons/:id`, (request, response, next) => {
  Person.findById(request.params.id).then( note => {
    response.json(note)
  }).catch( err => next(err) )
})

app.get(`/info`, (request, response) => {
  Person.find({}).then( res => {
    response.send(`PhoneBook has info for ${res.length} Persons </br> ${new Date().toString()}`)
  } )
} )







app.post(`/api/persons`, (request, response, next) => {
  const newPerson =  new Person(request.body)

  //if(!newPerson) return response.status(400).json({ error: `content missing` });
  //if(!newPerson.name || !newPerson.number) return response.status(400).json({ error: `missing information` });

  newPerson.save()
    .then(res => {response.json(res)})
    .catch(err => next(err))
} )


app.put(`/api/persons/:id`, (request, response, next) => {
  //console.log(request.body);
  Person.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: 'query' })
    .then( res => {
      //this is when the id doesnt exist, but for some reason the error doesnt get caught, and the server just returns an empty object
      if (!res) return response.status(400).send({ error: `bad request, item not found` })

      response.json(res)
    })
    .catch( err => next(err) )
})



app.delete(`/api/persons/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then( () => response.status(204).send())
    .catch( err => next(err) )
} )



app.use(unknownEndpoint)


app.use(errorHandler)



app.listen( PORT, () => {
  console.log(`server running :D`)
} )