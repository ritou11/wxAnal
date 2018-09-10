import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
      gender: [],
    };
  }

  calcGender(friends) {
    const res = _.reduce(friends, (sum, f) => ({
      男: sum['男'] + (f.Sex === 1),
      女: sum['女'] + (f.Sex === 2),
      NA: sum.NA + (f.Sex === 0),
    }), {
      男: 0,
      女: 0,
      NA: 0,
    });
    return _.map(res, (v, k) => ({
      name: k,
      y: v,
    }));
  }

  _loadFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const friends = JSON.parse(e.target.result);
        this.setState({
          friends,
          gender: this.calcGender(friends),
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
          <label>{this.state.friends.length}</label>
          <Input
            type="file"
            label="Keyword"
            onChange={this._fileChange.bind(this)} />
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: '20px',
            }}
            onClick={this._loadFile.bind(this)}>Load</Button>
        </div>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
              },
              colors: ['#2f7ed8', '#f45b5b', '#8bbc21'],
              title: {
                text: '微信好友性别分布',
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                    enabled: false,
                  },
                  showInLegend: true,
                },
              },
              series: [{
                name: '性别',
                colorByPoint: true,
                data: this.state.gender,
              }],
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
