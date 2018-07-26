import React, { Component } from 'react';
import { Button, Modal, Col } from 'antd';
import { Link } from "react-router-dom";
import * as firebase from 'firebase';

import Example from '../Example/Example';

var database = firebase.database();

class ReportsMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: this.props.name,
        admin: this.props.admin,
        members: this.props.members,
        pastReports: [],
        uid: Date.now(),
        newReport: false,
        runNumber: 1
    };
  }

  componentDidMount() {
    var arrReports = []
    var arrNumbers = []

      database.ref('reports').once('value', function (snap) {
        arrReports = []
        snap.forEach(function (report) {
          arrReports.push(report.val())
          arrNumbers.push(report.child('runNumber').val())
        })
        if(arrReports.length > 0) {
        var runNumber = Math.max(...arrNumbers) + 1;
        this.setState({ pastReports: arrReports, arrNumbers: arrNumbers, runNumber: runNumber })
        }else{
          this.setState({ runNumber: 1 })  
        }
      }.bind(this))
  }

  open() {
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false })
  }

  startReport() {
    var db = database.ref('reports');
    var reportData = {
      runNumber: this.state.runNumber,
      uid: this.state.uid.toString(),
    }
    this.setState({ newReport: true })
    return db.push(reportData)
  }

  render() {
    return (
      <div >
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
          <h2 style={{ textAlign: 'center' }}>Reports</h2>
        {this.state.newReport ? 
          <Example runNumber={this.state.runNumber} name={this.state.name} uid={this.state.uid.toString()} history={this.props.history} location={this.props.location.pathname} />
          : 
        <div>
              <Col xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 7 }} style={{ marginTop: '5em', marginBottom: '5em', textAlign: 'center' }} >
                <Button style={{ margin: '10px'}} onClick={this.open.bind(this)}>Past Reports</Button>
                <Button style={{ margin: '10px'}} onClick={this.startReport.bind(this)}>New Report</Button>
              </Col>
        <div>
{/* Past Reports List */}
          <Modal
            title='Past Reports'
            visible={this.state.show}
            onCancel={this.close.bind(this)}
            footer={null}
          >
            <ul>
              {this.state.pastReports.map((report, i) => {
                return (<li key={report.runNumber}>
                  <Link to={`/reports/${report.runNumber}`}>
                    {report.date}: {report.incidentType}
                  </Link>
                </li>)
              })
              }
            </ul>
          </Modal>
        </div>
        </div>
        }
        </Col>
      </div>
      
    );
  }
}

export default ReportsMaster;