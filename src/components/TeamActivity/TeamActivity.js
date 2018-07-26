import React, { Component } from 'react';
import { Button, Col, Tooltip, Icon } from 'antd';

import TRTActivity from './TRTActivity';
import H2oActivity from './H2oActivity';

import * as firebase from 'firebase';

var database = firebase.database();

class TeamActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rosters: null,
      users: null,
      btnLable: "See H2O Activity",
      view: "TRT"
    }
  }

  componentWillMount() {
    var team = []
    var rosterArr = []

    database.ref('rosters').on('value', function (snap) {
      rosterArr = []
      snap.forEach(function (item) {
        rosterArr.push(item.val())
      })
      this.setState({rosters: rosterArr})

      database.ref('users').on('value', function (snap) {
        team = []
        snap.forEach(function (item) {
          if (item.child('visable').val() !== "No") {
            team.push(item.val())
          }
        })
        var alpha = team.sort((a, b) => a.lastName.localeCompare(b.lastName))
        var objs = []
        alpha.forEach(function (member) {
          objs.push({ member: member.name, checked: false })
        })
        this.setState({ users: alpha })
      }.bind(this));

    }.bind(this))
  }

  changeView(){
      if(this.state.view === 'TRT'){
        this.setState({view: 'H2o', btnLable: "See TRT Activity"})
      }else
      this.setState({view: 'TRT', btnLable: "See H2O Activity"})
    }
  


  render() {
    var renderedThing = this.state.view === 'TRT'? 
      this.state.rosters && this.state.users ? <TRTActivity rosters={this.state.rosters} users={this.state.users} /> : 'loading...'
      : 
      <H2oActivity rosters={this.state.rosters} users={this.state.users} />

    
    return (
      <div>
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <div><h2>Team Activity 
          <Tooltip placement="right" title="Click a team member's name to see spacific events they attended">
            <Icon style={{ fontSize: '12px', marginLeft: '10px' }} type="question-circle" />
          </Tooltip></h2></div>
        <h3 style={{ marginLeft: '25px'}} >{this.state.view === 'TRT' ? 'Technical Rescue Team' : 'Water Rescue Team'} <Button style={{ marginLeft: '25px'}} size='small' onClick={this.changeView.bind(this)}> {this.state.btnLable} </Button></h3>
          {renderedThing}
          </Col>
      </div>
   
    );
  }
}

export default TeamActivity;