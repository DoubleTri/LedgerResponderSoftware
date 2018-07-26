import React, { Component } from 'react';
//import * as firebase from 'firebase';
import StepZilla from 'react-stepzilla'
//import { Link } from "react-router-dom";

import Numbers from '../Reports/Numbers'
import Narrative from '../Reports/Narrative'
import ReportRoster from '../Reports/ReportRoster'
import ReportPhotos from '../Reports/ReportPhotos'
import CostRcovery from '../Reports/CostRecovery'
import Complete from '../Reports/Complete'

//var database = firebase.database();

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: this.props.runNumber,
      reportKey: ''
    };

    this.sampleStore = {
      date: '',
      multiDay: false,
      name: this.props.name,
      runNumber: this.props.runNumber,
      reportKey: this.state.reportKey,
      incidentLocation: '',
      activationTime: '',
      arrivalTime: '',
      serviceTime: '',
      requesting: '',
      incidentType: '',
      initialActions: '',
      sustainedActions: '',
      termination: '',
      members: null,
      presentMembers: null,
      apparatus: null,
      presentApparatus: null,
      uid: this.props.uid
    };
  }

  componentWillMount() {
   
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
      {name: 'Complete', component: <Complete getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} history={this.props.history} location={this.props.location} />}
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
