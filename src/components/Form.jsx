import React, { useState, useEffect } from 'react'; 

function Form({ addTask, geoFindMe }) {
  const [name, setName] = useState(""); 
  const [addition, setAddition] = useState(false); 

  useEffect(() => { 
    if (addition) {
      console.log("useEffect detected addition");
      geoFindMe();
      setAddition(false);
    }
  });

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim() === "") return; 
    setAddition(true);
    addTask(name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          I Am Determined To Achieve My Goals!
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;