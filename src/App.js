import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './App.css';

const _ = require('lodash');

const data = [{ name: '北京', value: 89 }, { name: '天津', value: 42 }, { name: '河北', value: 6 }, { name: '山西', value: 84 }, { name: '内蒙古', value: 57 }, { name: '辽宁', value: 71 }, { name: '吉林', value: 4 }, { name: '黑龙江', value: 36 }, { name: '上海', value: 5 }, { name: '江苏', value: 80 }, { name: '浙江', value: 85 }, { name: '安徽', value: 28 }, { name: '福建', value: 18 }, { name: '江西', value: 59 }, { name: '山东', value: 51 }, { name: '河南', value: 44 }, { name: '湖北', value: 35 }, { name: '湖南', value: 81 }, { name: '广东', value: 29 }, { name: '广西', value: 58 }, { name: '海南', value: 27 }, { name: '重庆', value: 71 }, { name: '四川', value: 30 }, { name: '贵州', value: 59 }, { name: '云南', value: 55 }, { name: '西藏', value: 70 }, { name: '陕西', value: 6 }, { name: '甘肃', value: 18 }, { name: '青海', value: 68 }, { name: '宁夏', value: 80 }, { name: '新疆', value: 56 }, { name: '台湾', value: 29 }, { name: '香港', value: 51 }, { name: '澳门', value: 36 }, { name: '南海诸岛', value: 91 }, { name: '南海诸岛', value: 12 }];

// init the module
require('highcharts/modules/map')(Highcharts);
const mapData = require('./china');

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
      province: [],
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

  calcProvince(friends) {
    const res = _.reduce(friends, (sum, f) => Object.assign(sum, {
      [f.Province]: (sum[f.Province] || 0) + 1,
    }), {});
    return _.map(
      _.pickBy(res,
        (v, k) => !/[a-z,A-Z]/.exec(k)), // reject English
      (v, k) => ({
        name: k,
        value: v,
      }),
    );
  }

  _loadFile() {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const friends = JSON.parse(e.target.result);
        this.setState({
          friends,
          gender: this.calcGender(friends),
          province: this.calcProvince(friends),
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
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'mapChart'}
              options={{
                chart: {
                  map: mapData,
                },
                title: {
                  text: '微信好友分布',
                },
                mapNavigation: {
                  enabled: true,
                  buttonOptions: {
                    verticalAlign: 'bottom',
                  },
                },
                colorAxis: {
                  min: 0,
                },
                series: [{
                  data: this.state.province,
                  name: '位置',
                  joinBy: 'name',
                  states: {
                    hover: {
                      color: '#BADA55',
                    },
                  },
                  dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                  },
                }],
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
