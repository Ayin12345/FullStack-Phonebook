import React from 'react';

const Persons = ({ personsToShow, handleDelete }) => (
    <div>
        {personsToShow.map(person => <p key={person.name}>{person.name} {person.number} <button type="button" onClick={() => handleDelete(person)}>Delete</button></p>)}
    </div>
)

export default Persons;