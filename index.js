require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name == "CastError") {
    return response.status(400).send({error: "malformatted id"})
  }

  next(error)
}

app.use(express.json())
app.use(cors())
app.use(requestLogger)
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

  app.get('/info', (request, response) => {
  let date = new Date()
  Person.countDocuments({}).then((len) => {
    response.send(
      `<div>
        <p>The phonebook has info for ${len} people</p>
        <p>${date}</p>
      </div>`
    )
  })
  })

  app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map((person) => person.toJSON()))
  })
  })

  app.post('/api/persons', (request, response) => {

    const {name, number} = request.body;
    const person = new Person({name, number});
    person
      .save()
      .then((savedPerson) => {
        response.status(201).json(savedPerson.toJSON());
      })
      .catch((error) => next(error))

  });

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error))
  })
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    const person = {name, number};

    Person.findByIdAndUpdate(request.params.id, person, {
      new: true,
      runValidators: true,
      context: "query",
    })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))

  })

  
  app.use(unknownEndpoint)
  app.use(errorHandler)
  

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
