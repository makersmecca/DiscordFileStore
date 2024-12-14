import { useState } from "react";
import ImageBot from "./Components/ImageBot";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ImageBot />
    </>
  );
}

export default App;
