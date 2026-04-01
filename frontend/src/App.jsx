import { useState } from 'react';

function App() {
  const [test, setTest] = useState(0);
  return <div onClick={() => setTest(1)}>Hook test: {test}</div>;
}

export default App;
