import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';



const App = () => {
  const [newTest] = useState('meme')

  return (
    <div>
      {newTest}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
