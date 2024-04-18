import React from 'react';

const PersonForm = ({ onSubmit, newName, newNumber, onChange }) => (
    <form onSubmit={onSubmit}>
        <div>
            Name: <input value={newName} name="name" onChange={onChange}/>
        </div>
        <div>
            Number: <input value={newNumber} name="number" onChange={onChange}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

export default PersonForm;