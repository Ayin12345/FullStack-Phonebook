import React, { useState, useEffect } from 'react';
import personService from './services/persons';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';
import './index.css';

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ search, setSearch ] = useState('')
    const [ notificationMessage, setNotificationMessage ] = useState('')

    useEffect(() => {
        personService
            .getAll()
            .then(initialPerson => {
                setPersons(initialPerson);
            })
    }, [])

    const handleChange = (event) => {
        if (event.target.name === "name") {
            setNewName(event.target.value);
        } else if (event.target.name === "number") {
            setNewNumber(event.target.value);
        } else if (event.target.name === "search") {
            setSearch(event.target.value);
        }
    }

    const handleNotificationMessage = (message, type) => {
      if (type !== 'error') {
          setNewName('');
          setNewNumber('');
      }
      setNotificationMessage({
          message: message,
          type: type
      })
      setTimeout(() => {
          setNotificationMessage(null)
      }, 5000)
  }

    const handleDelete = (person) => {
        const result = window.confirm(`Delete ${person.name} from your phonebook?`);
        if (result) {
            personService
                .remove(person.id)
                .then(() => {
                    setPersons(persons.filter(pers => pers.id !== person.id))
                    handleNotificationMessage(`Deleted ${person.name}`, 'inform')
                })
                .catch(error => {
                    handleNotificationMessage(`Person ${person.name} was already removed from server`, 'error')
                })
        }
    }

    

    const addPerson = (event) => {
        event.preventDefault();

        if (persons.some((person) => person.name === newName)) {
            const person = persons.find(pers => pers.name === newName);
            const result = window.confirm(`${person.name} is already in your phonebook, do you want to replace the old phone number?`);
            if (result) {
                const changedPerson = {
                    ...person,
                    number: newNumber
                }
                personService
                    .update(person.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(pers => pers.id !== returnedPerson.id ? pers : returnedPerson));
                        handleNotificationMessage(`Updated ${returnedPerson.name}`, 'inform')
                    })
                    .catch(error => {
                      handleNotificationMessage(error.response.data.error, 'error')
                    })
            }
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    handleNotificationMessage(`Added ${returnedPerson.name}`, 'inform')
                })
                .catch(error => {
                  handleNotificationMessage(error.response.data.error, 'error')
                })
        }
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage} />
            <h3>Search</h3>
            <Filter search={search} onChange={handleChange} />
            <h3>Add a Number</h3>
            <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onChange={handleChange} />
            <h3>Numbers</h3>
            <Persons personsToShow={persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))} handleDelete={handleDelete} />
        </div>
    )
}

export default App