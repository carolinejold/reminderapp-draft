import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [hello, setHello] = useState("");

  useEffect(() => {
    async function fetchData() {
      let response = await axios(`http://localhost:5000/`);
      let result = await response.data.message;
      setHello(result);
      console.log(result);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      {hello}
      <p>I am a message on the front end :D </p>
    </div>
  );
}

export default App;
