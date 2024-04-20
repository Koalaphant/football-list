// PlayerList.js
import { useState } from "react";
import "./playerList.css";

const PlayerList = () => {
  const [name, setName] = useState("");
  const [submittedNames, setSubmittedNames] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedNames([...submittedNames, name]);
    setName("");
  };

  const handleRemove = (indexToRemove) => {
    const updatedNames = submittedNames.filter((_, index) => index !== indexToRemove);
    setSubmittedNames(updatedNames);
  };
  

  return (
    <>
      <h1>Enter your name:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
        />
        <button type="submit">Submit</button>
      </form>
      {submittedNames.map((name, index) => {
        return (
          <div className="name-list" key={index}>
            <p>
              {index + 1}: {name}
            </p>
            <p onClick={() => handleRemove(index)}>X</p>
          </div>
        );
      })}
    </>
  );
};

export default PlayerList;
