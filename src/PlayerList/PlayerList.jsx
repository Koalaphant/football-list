import { useState } from "react";

const PlayerList = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");

  return (
    <>
      <form onSubmit={hand}>
        <textarea
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Add your name"
        ></textarea>
        <button>Submit</button>
      </form>
    </>
  );
};

export default PlayerList;
