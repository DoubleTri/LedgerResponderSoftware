import React, { Component } from 'react';
import { Button, message } from 'antd';

import * as firebase from 'firebase';


var database = firebase.database();

var filter = require('lodash.filter');
var dateFormat = require('dateformat');

class CurrentlyOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      checkOuts: this.props.checkOuts,
      currentlyOut: false
    };
  }

  componentDidMount() {

    var arrEquipment = []
    database.ref('equipment').on('value', function (snap) {
      arrEquipment = []
      snap.forEach(function (equipment) {
        arrEquipment.push(equipment.val())
      })
      this.setState({checkOuts: arrEquipment})
      this.props.checkOuts.map((item) => {
        if(!item.to){
          this.setState({currentlyOut: true})
        }
        return true
      })
    }.bind(this));
  }


  delete(equipment) {
    var key = '';

    database.ref('equipment').orderByChild('equipment').equalTo(equipment).on("value", function (snap) {
      snap.forEach(function (data) {
        key = data.key
      });
    })

    var data = {
      to: new Date()
    }
    database.ref('equipment/' + key).update(data).then(function(){
      message.success('Thank you!')
    })
  }

  render() {

    var currentlyOut;
    
    for(var i = 0; i < this.state.checkOuts.length; i++){
      currentlyOut = <li key={i}>
      {this.state.checkOuts[i].to !== undefined ?
        null
        :
        <div>
          <span style={{ color: '#bf0000' }}><b>{this.state.checkOuts[i].equipment}</b></span><br />
          <b>Taken Off Of: </b>{this.state.checkOuts[i].takenOffOf}<br />
          <b>Checked Out On: </b>{dateFormat(this.state.checkOuts[i].from, "mmmm dS, yyyy")}<br />
          <b>By: </b>{this.state.checkOuts[i].name}
          <br />
          <br />
        </div>
      }
    </li>
    }

    var equipmentOutByUser = filter(this.state.checkOuts, { 'name': this.state.userName });

    var equipmentOutByUserLog = equipmentOutByUser.map((equipment) => (
      
      <li key={equipment.from}>
        {equipment.to === undefined ?
          <div>
            <b>You Signed Out: </b> {equipment.equipment}<br />
            <b>On: </b>{dateFormat(equipment.from, "mmmm dS, yyyy")}
            <br />
            <br />
            <Button onClick={this.delete.bind(this, equipment.equipment)}>Equipment Returned</Button>
            <br />
            <br />
          </div>
          :
         null
        }
      </li>
    ))

    return (
      <div>
        <br />
        <h3>Currently Out</h3>
        {this.state.currentlyOut ? <ul>{currentlyOut}</ul> : "No equipment currently signed out."}
        <hr />
        <ul>{equipmentOutByUserLog}</ul>
        <br />
      </div>
    )
  }
}

export default CurrentlyOut;