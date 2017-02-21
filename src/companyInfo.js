import React, { Component } from 'react';
var $ = require("jquery");

class CompanyInfo extends Component{

  constructor(props){
    super(props);
    this.state = {
      text: null,
      fullName: '',
      last: null
    }
  }

  getName(){
    if (this.state.last !== this.props.selected){
      if (this.props.selected){
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + this.props.selected;
        $.ajax({
          url: url,
          dataType: 'jsonp',
          success: (json) => {
              console.log('success');
              this.setState({fullName: ' - ' + json.Name, last: this.props.selected});
            }
        });
      }
    }
  }

  render(){
    this.getName();
    var textToDisplay = this.props.selected;
    if (!textToDisplay)
      textToDisplay = 'Select a company:';
    return (
      <div>
        <div className='companyInfo'>
          <h1>{textToDisplay}{this.state.fullName}</h1>
        </div>
      </div>
    );
  }
}

export default CompanyInfo;
