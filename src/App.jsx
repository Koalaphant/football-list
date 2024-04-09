import { useState } from "react";
import PlayerList from "./PlayerList/PlayerList.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PlayerList />
    </>
  );
}

export default App;
