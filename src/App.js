import React, { Component } from 'react';
import GraphLoader from './graph.js';
import CompanyInfo from './companyInfo';
import './App.css';
var $ = require("jquery");

class Card extends Component {

  constructor(props){
    super(props);
    this.state = {
      price: 'Loading...',
      change: 'Loading...'
    }
  }

  componentDidMount(){
    var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + this.props.company;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: (json) => {
          var change = (Math.round(json.Change * 100) / 100).toFixed(2);
          this.setState({price: json.LastPrice, change: change});
        }
    });
  }

  handleClick(){
    this.props.onChildClick(this.props.company);
  }

  render(){
    var newCard = this.props.selected !== this.props.company ?
      this.props.company :
        <span>
          {this.props.company}
        </span>

    //  style={{color:"orange"}} to span to help debugging

    var cardClasses = 'companyCard card-green';
    var addedToChange = '';

    if (this.state.change < 0)
      cardClasses = 'companyCard card-red';
    else
      addedToChange = '+';

    return (
      <div className='cardContainer' onClick={this.handleClick.bind(this)}>
        <div className={cardClasses}>
          <h1 className='companyName'>{newCard}<i className="fa fa-chevron-right" aria-hidden="true"></i></h1>
        </div>
        <div className='card-bottom'>
          <div className='currentPrice cardInfo'>{this.state.price}</div>
          <div className='change cardInfo'>{addedToChange}{this.state.change}%</div>
        </div>
      </div>
    );
  }
}


class Cards extends Component {
  render() {
    var cards = [];
    this.props.companies.forEach((company) => {
      cards.push(<Card company={company.name}
        selected={this.props.selected}
        onChildClick={this.props.updateSelected}
        key={company.name} />)
    });

    return (
      <div>
        {cards}
      </div>
    );
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      selected: null
    };
  }

  updateSelected(companyName){
    this.setState({
      selected: companyName
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Stocks</h2>
        </div>
        <GraphLoader selected={this.state.selected}/>
        <CompanyInfo selected={this.state.selected}/>
        <Cards companies={this.props.companies}
        selected={this.state.selected}
        updateSelected={this.updateSelected.bind(this)}/>
      </div>
    );
  }
}

export default App;
