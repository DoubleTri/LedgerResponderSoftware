import React, { Component } from 'react';
import jsPDF from 'jspdf';
import * as firebase from 'firebase';
import { Button, Col } from 'antd';

var database = firebase.database();
// var base64Img = require('base64-img');
// var image = require('../../logo.svg')

class PDF extends Component {
  constructor(props){
    super(props);
    this.state = {
      files: [],
      currentReport: this.props.reportInfo,
      name: this.props.name,
      runNumber: this.props.reportInfo.runNumber,
      addItem: [],
      itemsTotal: 0,
      team: '',
      presentPersonnel: [],
      leaders: [],
      techs: [],
      ops: [],
      supportStaff: [],
      stageOne: [],
      stageTwo: [],
      stageThree: []
    }
    this.pdfToHTML=this.pdfToHTML.bind(this);
  }

componentDidMount() {
  var that = this

  var team = []
  var presentPersonnel = []
  var leaders = []
  var techs = []
  var ops = []
  var supportStaff = []
  var stageOne = []
  var stageTwo = []
  var stageThree = []

  database.ref('reports/').orderByChild('runNumber').equalTo(this.props.reportInfo.runNumber).on("value", function (snap) {
    snap.forEach(function (data) {
      that.setState({ reportKey: data.key })
      database.ref('reports/' + data.key).on('value', function (snap) {
        that.setState({
          currentReport: snap.val(),
          addItem: snap.child('addItem').val(),
          itemsTotal: snap.child('itemsTotal').val(),
          apparatus: snap.child('apparatus').val(),
          presentApparatus: snap.child('presentApparatus').val()
        })
        snap.child('multiDay').val() === true ?
          that.setState({
            totalTime: (((((Date.parse(snap.child('serviceTime').val()) - Date.parse(snap.child('date').val() + ' ' + snap.child('activationTime').val()))) / 1000) / 60) / 60).toFixed(1),
            startTime: snap.child('date').val() + ' ' + snap.child('activationTime').val(),
            endTime: snap.child('serviceTime').val()
          })
          :
          that.setState({
            totalTime: (((((Date.parse(snap.child('date').val() + ' ' + snap.child('serviceTime').val()) - Date.parse(snap.child('date').val() + ' ' + snap.child('activationTime').val()))) / 1000) / 60) / 60).toFixed(1),
            startTime: snap.child('date').val() + ' ' + snap.child('activationTime').val(),
            endTime: snap.child('date').val() + ' ' + snap.child('serviceTime').val()
          })
        snap.child('apparatus').val().map((item) => {
          if (item.stage === 'Stage 1') {
            stageOne.push(item.truck)
          } else if (item.stage === 'Stage 2') {
            stageTwo.push(item.truck)
          } else if (item.stage === 'Stage 3') {
            stageThree.push(item.truck)
          }
          return true
        })
        that.setState({ stageOne, stageTwo, stageThree })
      });
    })
  });

  database.ref('users').once('value', function (snap) {
    snap.forEach(function (item) {
      if (item.child('visable').val() !== "No") {
        team.push(item.val())
      }
    })
    that.setState({ team: team.sort((a, b) => a.lastName.localeCompare(b.lastName)) })
  }).then(() => {

    // Gather all the people who were there
    team.map((member) => {
      for (var i = 0; i < that.state.currentReport.presentMembers.length; i++) {
        if (that.state.currentReport.presentMembers[i] === member.name) {
          presentPersonnel.push(member)
        }
      }
      return true
    })
    that.setState({ presentPersonnel })
  })
    .then(() => {
      presentPersonnel.map((member) => {
        if (member.admin) {
          leaders.push(member.name)
        }
        return true
      })
      this.setState({ leaders })
      return true
    })
    .then(() => {
// Water Rescue         
      if (this.state.currentReport.incidentType === "Water Rescue") {
        presentPersonnel.map((member) => {
          if (member.swiftWater === "Technician") {
            techs.push(member.name)
          } else if (member.swiftWater === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Confined Space       
      if (this.state.currentReport.incidentType === "Confined Space") {
        presentPersonnel.map((member) => {
          if (member.confinedSpace === "Technician") {
            techs.push(member.name)
          } else if (member.confinedSpace === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Rope Rescue       
      if (this.state.currentReport.incidentType === "Rope Rescue") {
        presentPersonnel.map((member) => {
          if (member.ropeRescue === "Technician") {
            techs.push(member.name)
          } else if (member.ropeRescue === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Trench Rescue       
      if (this.state.currentReport.incidentType === "Trench Rescue") {
        presentPersonnel.map((member) => {
          if (member.trenchRescue === "Technician") {
            techs.push(member.name)
          } else if (member.trenchRescue === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Building Collapse       
      if (this.state.currentReport.incidentType === "Building Collapse") {
        presentPersonnel.map((member) => {
          if (member.buildingCollapse === "Technician") {
            techs.push(member.name)
          } else if (member.buildingCollapse === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Vehicle Extrication     
      if (this.state.currentReport.incidentType === "Vehicle Extrication") {
        presentPersonnel.map((member) => {
          if (member.vehicleExtrication === "Technician") {
            techs.push(member.name)
          } else if (member.vehicleExtrication === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    }).then(() => {
// Grain Bin Rescue    
      if (this.state.currentReport.incidentType === "Grain Bin Rescue") {
        presentPersonnel.map((member) => {
          if (member.grainBin === "Technician") {
            techs.push(member.name)
          } else if (member.grainBin === "Operations") {
            ops.push(member.name)
          } else {
            supportStaff.push(member.name)
          }
          return true
        })
      }
      this.setState({ techs, ops, supportStaff })
    })
    .catch((error) => {
      console.log(error);
    });
}

  pdfToHTML() {
    var pdf = new jsPDF('p', 'pt', 'letter')
    //var image = this.state.image
    var numbers = (this.refs.numbers)
    var staff = (this.refs.staff)
    var narrative = (this.refs.narrative)
    var costRecovery = (this.refs.costRecovery)
    var specialElementHandlers = {
      '#bypassme': function (element, renderer) {
        return true
      }
    };

    var margins = {
      top: 50,
      left: 60,
      width: 500
    };

    //pdf.addImage(image, 'PNG', 15, 15, 15, 15);
    pdf.text(295, 60, 'Washtenaw County Technical Rescue Team', null, null, 'center');
    pdf.text(295, 85, 'Incident Report', null, null, 'center');
    pdf.fromHTML(
      numbers// HTML string or DOM elem ref.
      , margins.left // x coord
      , 130 // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      })
    pdf.line(200, 355, 60, 355)
    pdf.fromHTML(
      staff// HTML string or DOM elem ref.
      , margins.left // x coord
      , 365 // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      })
    pdf.addPage()
    pdf.fromHTML(
      narrative// HTML string or DOM elem ref.
      , margins.left // x coord
      , margins.top // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      })
    pdf.addPage()
    pdf.text(295, 60, 'Washtenaw County Technical Rescue Team', null, null, 'center');
    pdf.text(295, 85, 'Cost Recovery Breakdown', null, null, 'center');
    pdf.fromHTML(
      costRecovery// HTML string or DOM elem ref.
      , margins.left // x coord
      , 130 // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      })
      pdf.save('test')
  }

  render() {

    var leaderTotal = this.state.leaders.length * this.state.totalTime * 75;
    var techsTotal = this.state.techs.length * this.state.totalTime * 65;
    var opsTotal = this.state.ops.length * this.state.totalTime * 55;
    var supportStaffTotal = this.state.supportStaff.length * this.state.totalTime * 45;

    var personnalTotal = leaderTotal + techsTotal + opsTotal + supportStaffTotal

    var stageOne = [] 
    var stageTwo = [] 
    var stageThree = []

    if (this.state.presentApparatus) {
    this.state.stageOne.map((item, i) => {
      i === this.state.stageOne.length - 1 ? stageOne.push(item) : stageOne.push(item + ', ')
      return true
    })
    this.state.stageTwo.map((item, i) => {
      i === this.state.stageTwo.length - 1 ? stageTwo.push(item) : stageTwo.push(item + ', ')
      return true
    })
    this.state.stageThree.map((item, i) => {
      i === this.state.stageThree.length - 1 ? stageThree.push(item) : stageThree.push(item + ', ')
      return true
    })
  }

  var items = this.state.addItem && this.state.addItem.length > 0 ? 
  this.state.addItem.map((item, i) => {
    return <li key={item.item + i}><div style={{ fontSize: "8px", marginLeft: "12px" }}>{item.item}: ${item.cost} x {item.quantity}<b> = ${item.total}</b></div></li>
  })
  :
  'loading....'

    return (
      <div>
        <div style={{ display: 'none' }}>

          <div ref="numbers" >
            <div style={{ marginBottom: "14px" }}>
              <b>Date:</b> {this.props.reportInfo.date}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <b>Incident Type:</b> {this.props.reportInfo.incidentType}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <b>WCTRT Run Number:</b> {this.props.reportInfo.runNumber}
              <br />
              <b>Report Completed By:</b> {this.props.reportInfo.name}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <b>Requesting Agency:</b> {this.props.reportInfo.requesting}
              <br />
              <b>Location:</b> {this.props.reportInfo.incidentLocation}
            </div>
            <div>
              <b>Activation Time:</b> {this.props.reportInfo.activationTime}
              <br />
              <b>Arrival Time:</b> {this.props.reportInfo.arrivalTime}
              <br />
              <b>Service Time:</b> {this.props.reportInfo.serviceTime}
              <br />
              <b>Total Incident Time:</b> {this.state.totalTime} Hours
          </div>
          </div>

          <div ref="staff">
            <p>
              <b>Personnel on Scene:</b> {this.props.reportInfo.presentMembers.toString().replace(/,/g, ', ')}
            </p>
            <p>
              <b>Apparatus on Scene:</b> {this.props.reportInfo.presentApparatus.toString().replace(/,/g, ', ')}
            </p>
          </div>

          <div ref="narrative" >
            <div><b>Initial Actions:</b>  <div style={{ fontSize: "11px" }}> {this.props.reportInfo.initialActions}</div></div>
            <br />
            <div style={{ marginTop: "14px" }}><b>Sustained Actions:</b> <div style={{ fontSize: "11px" }}> {this.props.reportInfo.sustainedActions}</div></div>
            <br />
            <div style={{ marginTop: "14px" }}><b>Termination:</b> <div style={{ fontSize: "11px" }}> {this.props.reportInfo.termination}</div></div>
          </div>

          <div ref="costRecovery" >
            <b>WCTRT Run Number:</b> {this.props.reportInfo.runNumber}
            <br />
            <b>Total Incident Time:</b> {this.state.totalTime} Hours
          <div style={{ fontSize: "8px", marginLeft: "14px" }}>{this.state.currentReport ? <p>{this.state.startTime} to {this.state.endTime}</p> : 'Loading...'}</div>
            <br />

            <b>Personnal:</b><br />



            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <b>Team Administrators [{this.state.leaders.length}]</b>
              <div style={{ fontSize: "8px", marginLeft: "12px" }}>{this.state.leaders.toString().replace(/,/g, ', ')}</div>
              <div style={{ marginLeft: "12px" }}>Total = ${leaderTotal.toFixed(2)}</div>
              <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Team Administrators ({this.state.leaders.length}) x Total Incident Time ({this.state.totalTime} Hours) x $75</div>
            </div>
            <br />

            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <b>Technican Level Personnel [{this.state.techs.length}]</b>
              <div style={{ fontSize: "8px" }}>{this.state.techs.toString().replace(/,/g, ', ')} </div>
              <div style={{ marginLeft: "12px" }}>Total = ${techsTotal.toFixed(2)}</div>
              <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Technican Level Personnal ({this.state.techs.length}) x Total Incident Time ({this.state.totalTime} Hours) x $65</div>
            </div>
            <br />

            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <b>Operations Level Personnel [{this.state.ops.length}]</b>
              <div style={{ fontSize: "8px" }}>{this.state.ops.toString().replace(/,/g, ', ')}</div>
              <div style={{ marginLeft: "12px" }}>Total = ${opsTotal.toFixed(2)}</div>
              <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Operations Level Personnal ({this.state.ops.length}) x Total Incident Time ({this.state.totalTime} Hours) x $55</div>
            </div>
            <br />

            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <b>Supporting Personnel [{this.state.supportStaff.length}]</b>
              <div style={{ fontSize: "8px", marginLeft: "12px" }}>{this.state.supportStaff.toString().replace(/,/g, ', ')}</div>
              <div style={{ marginLeft: "12px" }}>Total = ${supportStaffTotal.toFixed(2)}</div>
              <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Supporting Personnal ({this.state.supportStaff.length}) x Total Incident Time ({this.state.totalTime} Hours) x $45</div>
            </div>

            <br />
            <div style={{ marginBottom: "12px", fontSize: "12px" }}><b>PERSONNEL TOTAL = ${personnalTotal.toFixed(2)}</b></div>

            <br />
            <br />
            <b>Apparatus Used On Scene:</b>

            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <b>Stage One [{this.state.stageOne.length}] </b>
              <div style={{ fontSize: "8px", marginLeft: "12px" }}>{stageOne}</div>
              <div style={{ marginLeft: "12px" }}>Total = ${this.state.stageOne.length * 1000.00}</div>
              <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Stage One Apparatus ({this.state.stageOne.length}) x $1000 Flat Rate</div>
              <div />

              <div style={{ marginLeft: "12px", fontSize: "12px" }}>
                <b>Stage Two [{this.state.stageTwo.length}] </b>
                <div style={{ fontSize: "8px", marginLeft: "12px" }}>{stageTwo}</div>
                <div style={{ marginLeft: "12px" }}>Total = ${this.state.stageTwo.length * 500.00}</div>
                <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Stage Two Apparatus ({this.state.stageTwo.length}) x $500 Flat Rate</div>
              </div>

              <div style={{ marginLeft: "12px", fontSize: "12px" }}>
                <b>Stage Three [{this.state.stageThree.length}] </b>
                <div style={{ fontSize: "8px", marginLeft: "12px" }}>{stageThree}</div>
                <div style={{ marginLeft: "12px" }}>Total = ${this.state.stageThree.length * 250.00}</div>
                <div style={{ fontSize: "8px", marginLeft: "12px", marginBottom: "12px" }}>Stage Three Apparatus ({this.state.stageThree.length}) x $250 Flat Rate</div>
              </div>

            </div>

            <br />
            <div style={{ marginBottom: "12px", fontSize: "12px" }}><b>APPARATUS TOTAL = ${((this.state.stageThree.length * 250.00) + (this.state.stageTwo.length * 500.00) + (this.state.stageOne.length * 1000.00)).toFixed(2)}</b></div>

            <br />
            <br />
            <b>Equipment:</b>
            <div style={{ marginLeft: "12px", fontSize: "12px" }}>
              <ul>
                {items}
              </ul>
            </div>
            <div style={{ marginBottom: "12px", fontSize: "12px" }}><b>EQUIPMENT TOTAL = ${this.state.itemsTotal ? (this.state.itemsTotal).toFixed(2) : '$0.00'}</b></div>
            <br />
            <br />

            <div style={{ fontSize: '16px' }}><b>COST RECOVERY TOTAL = ${((
              this.state.itemsTotal +
              personnalTotal +
              (this.state.stageThree.length * 250.00) +
              (this.state.stageTwo.length * 500.00) +
              (this.state.stageOne.length * 1000.00)
            ) * 1.15).toFixed(2)}</b></div>
            <div style={{ fontSize: "8px" }}>This includes an additional 15% for administrative fees</div>

          </div>
        </div>

        <Button onClick={this.pdfToHTML}>Download PDF</Button>
      </div>
    );
  } 

}
  
  export default PDF;