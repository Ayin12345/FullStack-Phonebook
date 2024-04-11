const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan((tokens, req, res) => {
  const method = tokens.method(req,res)

  if(method === 'POST') {
    const body = JSON.stringify(req.body)

    return [
      tokens.method(req,res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      body
    ].join(' ')
  }
  return [
    tokens.method(req,res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    body
  ].join(' ')
}))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

    app.get('/info', (request, response) => {
    let date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
    })

    app.get('/api/persons', (request, response) => {
      response.json(persons)
      })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
    response.json(person)
    } else {
      response.status(404).end()
    }
  })
  app.delete('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

  const randomId = () => {
    const randomId = Math.floor(Math.random() * 125)
    return randomId
  }

  app.post('/api/persons', (request, response) => {

    if (!request.body.name || !request.body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    let person = {
      name: request.body.name,
      number: request.body.number,
      id: randomId()
    }

    persons = persons.concat(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
