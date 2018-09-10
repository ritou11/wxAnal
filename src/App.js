import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import './App.css';

const _ = require('lodash');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filepath: '',
      res: [],
      update: false,
      more: false,
      friends: [],
    };
  }

  _loadFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const friends = JSON.parse(e.target.result);
        this.setState({
          friends,
        });
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(this.state.filepath);
  }

  _fileChange(e) {
    this.setState({
      filepath: e.target.files[0],
    });
  }

  _keyDown(e) {
    if (e.key === 'Enter') {
      this._loadFile();
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wechat Analysis</h1>
        </header>
        <div>
          <Input
            type="file"
            label="Keyword"
            onChange={this._fileChange.bind(this)} />
          <Button
            variant="contained"
            color="primary"
            onClick={this._loadFile.bind(this)}>Load</Button>
        </div>
        <div> {this.state.friends.length} </div>
      </div>
    );
  }
}

export default App;
