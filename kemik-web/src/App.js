import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LabelForm from './kemik/LabelForm.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Veriseti Etiketleme</h1>
        </header>
        <div>
          <LabelForm/>
        </div>
      </div>
    );
  }
}

export default App;
