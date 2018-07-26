import React, { Component } from 'react';
//import * as firebase from 'firebase';
import StepZilla from 'react-stepzilla';
//import { Link } from "react-router-dom";

import Numbers from '../Reports/Numbers'
import Narrative from '../Reports/Narrative'
import ReportRoster from '../Reports/ReportRoster'
import ReportPhotos from '../Reports/ReportPhotos'
import CostRcovery from '../Reports/CostRecovery'
import Complete from '../Reports/Complete'

//var database = firebase.database();

export default class PastExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: parseInt(this.props.runInfo.runNumber, 10),
      reportKey: ''
    };

    this.sampleStore = {
        date: this.props.runInfo.date,
        multiDay: this.props.runInfo.multiDay,
        name: this.props.runInfo.name,
        runNumber: this.props.runInfo.runNumber,

        reportKey: this.state.reportKey,

        incidentLocation: this.props.runInfo.incidentLocation,
        activationTime: this.props.runInfo.activationTime,
        arrivalTime: this.props.runInfo.arrivalTime,
        serviceTime: this.props.runInfo.serviceTime,
        requesting: this.props.runInfo.requesting,
        incidentType: this.props.runInfo.incidentType,
        initialActions: this.props.runInfo.initialActions,
        sustainedActions: this.props.runInfo.sustainedActions,
        termination: this.props.runInfo.termination,
        members: this.props.runInfo.members,
        presentMembers: this.props.runInfo.presentMembers,
        apparatus: this.props.runInfo.apparatus,
        presentApparatus: this.props.runInfo.presentApparatus,
        uid: this.props.runInfo.uid
    };
  }

  componentWillMount() {
    console.log(this.props.reportInfo)
  }

  getStore() {
    return this.sampleStore;
  }

  updateStore(update) {
    this.sampleStore = {
      ...this.sampleStore,
      ...update,
    }
  }

  render() {
    const steps =
    [
      {name: 'Times/Numbers', component: <Numbers getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} runNumber={this.state.runNumber} name={this.state.name} />},
      {name: 'Narrative', component: <Narrative getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Roster', component: <ReportRoster getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Photos', component: <ReportPhotos getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: 'Cost Recovery', component: <CostRcovery getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} runNumber={this.state.runNumber} currentReport={true} />},
      {name: 'Complete', component: <Complete getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} history={this.props.history} location={this.props.location.pathname}/>}
    ]

    return (
      <div className='example'>
        <div className='step-progress'>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={"Save"}
            startAtStep={0}
            showNavigation={false}
            stepsNavigation={false}
            onStepChange={(step) => console.log(step)}
           />
        </div>
      </div>
    )
  }
}
