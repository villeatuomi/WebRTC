import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';



const App = () => {
  const [newTest] = useState('meme')

  return (
    <div>
      {newTest}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

/*

        !!!!*** VILLE READ TEXT BELOW ***!!!!

*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
