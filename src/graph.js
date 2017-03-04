import React, { Component } from 'react';
import Chart from 'chart.js';
import RC2 from 'react-chartjs2';
import './graph.css';
var $ = require("jquery");

var DATA = null;
var LAST_SELECTED = null;

class TimeSelector extends Component {

  render(){
    var steps = [7, 30, 180, 365];
    var classes = [];
    for (var i = 0; i < 4; i++){
      if (steps[i] === this.props.days){
        classes.push('timeSelector selected');
      } else {
        classes.push('timeSelector');
      }
    }
    return (
      <div className='rangeSelector'>
        <div className='timeSelectorTitle'>RANGE</div>
        <div className={classes[0]} onClick={() => { this.props.changedays(7) }}>1W</div>
        <div className={classes[1]} onClick={() => { this.props.changedays(30) }}>1M</div>
        <div className={classes[2]} onClick={() => { this.props.changedays(180) }}>6M</div>
        <div className={classes[3]} onClick={() => { this.props.changedays(365) }}>1Y</div>
      </div>
    );
  }

}

class Graph extends Component {

  generateDataObject(data){
    if (data){
      // data = data.Elements[0].DataSeries.open.values;
      return (
        {
          labels: data,
          datasets: [
            {
              fill: true,
              lineTension: 0.2,
              backgroundColor: 'rgb(50, 63, 72)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: data,
            }
          ],
        }
      );
    }
    else {
      return {};
    }
  }

  render(){
    var d = this.generateDataObject(DATA);
    var options = {
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes:[{
          ticks: {
            fontSize: 20
          }
        }],
      },
      tooltips: {
        titleFontSize: 30,
        displayColors: false,
        bodyFontSize: 0,
      }
    }
    return (
      <RC2
        data={d}
        type='line'
        options={options}
      />
    );
  }
}

class GraphLoader extends Component {

  constructor(props){
    super(props);
    this.data = null;
    this.state = {
      days: 30,
      graphStatus: 'No company selected',
      lastSelected: this.props.selected,
      data: null
    };
  }

  componentDidMount(){
    if (this.data){
      DATA = this.data.Elements[0].DataSeries.open.values;
    }
    this.setState({days: this.state.days});
    Chart.defaults.global.legend.display = false;
  }

  updateDays(days){
    console.log('updated range to ' + days + ' days.');
    LAST_SELECTED = null;
    this.setState({days: days});
  }

  getParam(){
    return {
        Normalized: false,
        NumberOfDays: this.state.days,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: this.props.selected,
                Type: "price",
                Params: ["ohlc"] //ohlc, c = close only
            },
            {
                Symbol: this.props.selected,
                Type: "volume"
            }
        ]
    }
  }

  updateData(){
    var params = {
      parameters: JSON.stringify(this.getParam())
    }
    $.ajax({
      beforeSend:function(){
        $("#graphMsg").text("Loading chart...");
      },
      data: params,
      url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
      dataType: "jsonp",
      context: this,
      success: function(json){
        if (!json || json.Message){
          console.error("Error: ", json.Message);
          return;
        }
        $("#graphMsg").text("Data loaded successfully");
        this.data = json;
        //Call this to update the graph.
        this.componentDidMount();
      },
      error: function(response, txtStatus){
        $("#graphMsg").text("Error loading data");
        alert("Service currently unavailable, please try again later.");
        console.log(response, txtStatus);
      }
    });
  }

  render(){
    if (this.props.selected && this.props.selected !== LAST_SELECTED){
      this.updateData();
    }
    LAST_SELECTED = this.props.selected;
    return(
      <div>
        <TimeSelector changedays={this.updateDays.bind(this)} days={this.state.days}/>
        <h1 id='graphMsg'>Status</h1>
        <Graph days={this.state.days}/>
      </div>
    );
  };
}

export default GraphLoader;
