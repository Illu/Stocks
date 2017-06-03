import React, { Component } from 'react';
import GraphLoader from './graph.js';
import CompanyInfo from './companyInfo';
import './App.css';
var $ = require("jquery");

class AddCard extends Component {

  onKeyPress = (e) => {
    if (e.key === 'Enter') {

      var newCompany = {
        name: e.target.value,
        selected: false
      }

      this.refs.newCardInput.value = '';
      this.props.updateCompanies(newCompany);
    }
  }

  render(){
    return (
      <div className='cardContainer'>
        <div className='addCard'>
          <input className="ticker-input" placeholder="Enter ticker symbol..." onKeyPress={this.onKeyPress} ref="newCardInput"></input>
        </div>
      </div>
    );
  }
}

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
    var i = 0;
    this.props.companies.forEach((company) => {

      //generate a key. (cannot use the company name as a key
      // because the user might add the same company twice)
      var key = company.name + i;
      i++;

      cards.push(<Card company={company.name}
        selected={this.props.selected}
        onChildClick={this.props.updateSelected}
        key={key} />)
    });

    cards.push(<AddCard key='addCard' updateCompanies={this.props.updateCompanies} companies={this.props.companies}/>);

    return (
      <div className='cards-container'>
        {cards}
      </div>
    );
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      selected: null,
      companies: this.props.companies
    };
  }

  updateSelected(companyName){
    this.setState({
      selected: companyName
    });
  }

  updateCompanies(newCompany){
    var tmp = this.state.companies;
    tmp.push(newCompany);
    tmp.shift();
    this.setState({companies: tmp});

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Stocks</h2>
        </div>
        <GraphLoader selected={this.state.selected}/>
        <CompanyInfo selected={this.state.selected}/>
        <Cards companies={this.state.companies}
        selected={this.state.selected}
        updateSelected={this.updateSelected.bind(this)}
        updateCompanies={this.updateCompanies.bind(this)}/>
      </div>
    );
  }
}

export default App;
