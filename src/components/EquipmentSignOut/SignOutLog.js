import React, { Component } from 'react';

var dateFormat = require('dateformat');

class SignOutLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      checkOuts: this.props.checkOuts
    };
  } 
     
  render() {

    var returned = this.state.checkOuts.map((checkOuts) => (
    <li key={checkOuts.from}>
    {checkOuts.to !== undefined ?
      <div>
      <b>Equipment: </b> {checkOuts.equipment}<br /> 
      <b>Off Of: </b> {checkOuts.takenOffOf}<br />
      <b>By: </b> {checkOuts.name}<br />
      <b>Checked Out On: </b> {dateFormat(checkOuts.from, "mmmm dS, yyyy")}<br />
      <b>Returned On: </b> {dateFormat(checkOuts.to, "mmmm dS, yyyy")}
        <br />
        <br />
      </div>
      :
      ''
    }
    </li>
    ))

    return (
      <div>
            <ul>{returned}</ul>
      </div>
    );
  }
}
  
  export default SignOutLog;