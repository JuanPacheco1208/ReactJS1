import logo from './logo.svg';
import './App.css';

function app() {
    return (
        <div className="App">
            <header className= "App-logo" alt="logo" />
            <img src= {logo} className="app-logo" alt="logo"/>
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
            className="app-link"
            href="https://reactjs.org"
            target= "_blank"
            rel="noopener noreferrer"
            >
                Chess Shop
            </a>
        </div>
    )
}