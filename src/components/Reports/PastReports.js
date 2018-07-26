import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Col } from 'antd';

import PastExample from '../Example/PastExample'

var database = firebase.database();

class PastReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiDay: false,
      show: false,
      runNumber: this.props.match.params.runNumber,
      name: this.props.name,
      admin: this.props.admin
    };
  }

  componentWillMount() {
    var currentRun = [];
    var arrReports = [];

    var that = this;
    var rosterKey = '';
    var reportKey = '';

    database.ref('reports').on('value', function (snap) {
      currentRun = []
      arrReports = []
      snap.forEach(function (report) {
        arrReports.push(report.val())
      })
      arrReports.map((run) => {
        if (this.props.match.params.runNumber === run.runNumber.toString()) {
          currentRun.push({ run })
        }
        return true
      })
      if (currentRun[0].run.multiDay === true) { this.setState({ multiDay: true }) }
      this.setState({
        members: currentRun[0].run.members,
        presentMembers: currentRun[0].run.presentMembers,
        apparatus: currentRun[0].run.apparatus,
        presentApparatus: currentRun[0].run.presentApparatus,
        date: currentRun[0].run.date,
        name: currentRun[0].run.name,
        runNumber: currentRun[0].run.runNumber,
        incidentLocation: currentRun[0].run.incidentLocation,
        multiDay: currentRun[0].run.multiDay,
        activationTime: currentRun[0].run.activationTime,
        arrivalTime: currentRun[0].run.arrivalTime,
        serviceTime: currentRun[0].run.serviceTime,
        requesting: currentRun[0].run.requesting,
        incidentType: currentRun[0].run.incidentType,
        initialActions: currentRun[0].run.initialActions,
        sustainedActions: currentRun[0].run.sustainedActions,
        termination: currentRun[0].run.termination,
        uid: currentRun[0].run.uid
      })

      database.ref('rosters').orderByChild('uid').equalTo(currentRun[0].run.uid).on('value', function (snap) {
        snap.forEach(function (data) {
          rosterKey = data.key
        })
        that.setState({ rosterKey })
      })
      database.ref('reports').orderByChild('uid').equalTo(currentRun[0].run.uid).on('value', function (snap) {
        snap.forEach(function (data) {
          reportKey = data.key
        })
        that.setState({ reportKey })
      })
    }.bind(this));
   
  }

  render() {

    return (
      <div className='example'>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        {this.state.uid ? <PastExample runInfo={this.state} history={this.props.history} location={this.props.location} /> : 'Loading...' }
        </Col>
      </div>
    )
  }
}

export default PastReports;