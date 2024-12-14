import { useState } from "react";
import FileBot from "./Components/FileBot";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FileBot />
    </>
  );
}

export default App;
