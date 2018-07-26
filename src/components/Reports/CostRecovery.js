import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Button, Input, Icon, InputNumber, Col } from 'antd';
//import moment from 'moment';

const FormItem = Form.Item;
var database = firebase.database();


class CostRecoveryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: this.props.runNumber,
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
    };
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

    database.ref('reports/').orderByChild('runNumber').equalTo(this.props.runNumber).on("value", function (snap) {
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
            if (item.checked && item.stage === 'Stage 1') {
              stageOne.push(item.truck)
            } else if (item.checked && item.stage === 'Stage 2') {
              stageTwo.push(item.truck)
            } else if (item.checked && item.stage === 'Stage 3') {
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

  addItem(e) {
    e.preventDefault()

    var item = this.props.form.getFieldValue('item')
    var cost = this.props.form.getFieldValue('cost')
    var quantity = this.props.form.getFieldValue('quantity')
    var total = cost * quantity

    this.setState({ 
      addItem: this.state.addItem ? this.state.addItem.concat([{item, cost, quantity, total}]) : [{item, cost, quantity, total}],
      itemsTotal: this.state.itemsTotal + total
    })
    this.props.form.resetFields()
  }

  delete(key) {
    var newState = this.state.addItem.filter(x => x.item !== key);
    var deletedTotal = this.state.addItem.filter(x => x.item === key)[0].total;

    this.setState({ 
      addItem: newState,  
      itemsTotal: this.state.itemsTotal - deletedTotal 
    })
  }

  previous() {
    return this.props.jumpToStep(3)
  }

  submit() {
    var reportData = {
      addItem: this.state.addItem,
      itemsTotal: this.state.itemsTotal,
    }
    database.ref('reports/' + this.state.reportKey).update(reportData)
    return this.props.jumpToStep(5)
  }

  render() {

    var leaderTotal = this.state.leaders.length * this.state.totalTime * 75;
    var techsTotal = this.state.techs.length * this.state.totalTime * 65;
    var opsTotal = this.state.ops.length * this.state.totalTime * 55;
    var supportStaffTotal = this.state.supportStaff.length * this.state.totalTime * 45;
    //var stageOne = this.state.stageOne.length * 1000;

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
        return <li key={item.item + i}>{item.item}: ${item.cost} x {item.quantity}<b> = {item.total}</b><Icon style={{ marginLeft: '20px'}} onClick={this.delete.bind(this, item.item )} type="close-circle-o" /></li>
      })
      :
      'No items added'
    
    const { getFieldDecorator } = this.props.form;
  
    return (
      <div>
        <Col xs={{ span: 22, offset: 1}} md={{ span: 18, offset: 3}}>
          <b style={{ fontSize: "18px", marginTop: '15px', marginBottom: '15px' }}>WCTRT Cost Recovery - Incident #{this.props.runNumber}</b>

          <div style={{ marginLeft: '3em',  marginTop: '2em' }}><b>Total Incident Time:</b> {this.state.totalTime} Hours
          <br />
          <div style={{ fontSize: "12px", marginLeft: "14px" }}>{this.state.currentReport ? <p>{this.state.startTime} to {this.state.endTime}</p> : 'Loading...'}</div>
          </div>
          <br />
          <hr />
          <b>Personnal Costs:</b>
          <br />
          <div style={{ marginLeft: '3em',  marginTop: '2em' }}>
            <b>Team Administrators [{this.state.leaders.length}]</b>  
            <div>{this.state.leaders.toString().replace(/,/g, ', ')}</div> <br /> 
            <div style={{ fontSize: "12px", marginLeft: "14px" }}>Team Administrators ({this.state.leaders.length}) x Total Incident Time ({this.state.totalTime} Hours) x $75</div>
            Total = ${leaderTotal.toFixed(2)}<br />
            <br />

            <b>Technican Level Personnel [{this.state.techs.length}]</b> 
            <div>{this.state.techs.toString().replace(/,/g, ', ')} </div><br />
            <div style={{ fontSize: "12px", marginLeft: "14px" }}>Technican Level Personnal ({this.state.techs.length}) x Total Incident Time ({this.state.totalTime} Hours) x $65</div>
            Total = ${techsTotal.toFixed(2)}<br />
            <br />

            <b>Operations Level Personnel [{this.state.ops.length}]</b> 
            <div>{this.state.ops.toString().replace(/,/g, ', ')}</div> <br />
            <div style={{ fontSize: "12px", marginLeft: "14px" }}>Operations Level Personnal ({this.state.ops.length}) x Total Incident Time ({this.state.totalTime} Hours) x $55</div>
            Total = ${opsTotal.toFixed(2)}<br />
            <br />

            <b>Supporting Personnal [{this.state.supportStaff.length}]</b> 
            <div>{this.state.supportStaff.toString().replace(/,/g, ', ')}</div>
            <div style={{ fontSize: "12px", marginLeft: "14px" }}>Supporting Personnal ({this.state.supportStaff.length}) x Total Incident Time ({this.state.totalTime} Hours) x $45</div>
            Total = ${supportStaffTotal.toFixed(2)}<br />
            <br />

            <b>MAN POWER TOTAL = ${personnalTotal.toFixed(2)}</b>
          </div>
          <br />
          <hr />

          <b>Apparatus Used On Scene:</b>
          <br />
          <div style={{ marginLeft: '3em', marginTop: '2em' }}>
          <div><b>Stage One [{this.state.stageOne.length}] </b></div>  
          <div>{stageOne}</div> 
          <div style={{ fontSize: "12px", marginLeft: "14px" }}>Stage One Apparatus ({this.state.stageOne.length}) x $1000 Flat Rate</div>
          Total = ${this.state.stageOne.length * 1000.00}<br />
          <br />

          <div><b>Stage Two [{this.state.stageTwo.length}] </b></div>
          <div>{stageTwo}</div>
          <div style={{ fontSize: "12px", marginLeft: "14px" }}>Stage Two Apparatus ({this.state.stageTwo.length}) x $500 Flat Rate</div>
          Total = ${this.state.stageTwo.length * 500.00}<br />
          <br />

          <div><b>Stage Three [{this.state.stageThree.length}] </b></div>
          <div>{stageThree}</div>
          <div style={{ fontSize: "12px", marginLeft: "14px" }}>Stage Three Apparatus ({this.state.stageThree.length}) x $250 Flat Rate</div>
          Total = ${this.state.stageThree.length * 250.00}<br />
          <br />
          
          <b>APPARATUS TOTAL = ${((this.state.stageThree.length * 250.00) + (this.state.stageTwo.length * 500.00) + (this.state.stageOne.length * 1000.00)).toFixed(2)}</b>
          </div>
          <br />
          <hr />

          <b>Material Used:</b>
          <br />
          <div style={{ marginLeft: '3em', marginTop: '2em' }}>
          <ul>
            {items}
          </ul>
          <br />
          <b>ITEMS TOTAL = ${this.state.itemsTotal}</b>
          </div>
          <br />

        <Form onSubmit={this.addItem.bind(this)} className="createItemForm" layout="inline">

          <FormItem>
            {getFieldDecorator('item', {
              rules: [{ required: true }, {max: 100}],
            })(
              <Input placeholder="Item" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('cost', {
              rules: [{ required: true }],
            })(
              <Input type='number' placeholder="Cost" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('quantity', {
              rules: [{ required: true }],
            })(
              <InputNumber min={1} max={1000} placeholder="Quantity" />
            )}
          </FormItem>

          <Button htmlType="submit">Submit Item</Button>

        </Form>

          <br />
          <hr />
        <b style={{ fontSize: "18px", marginTop: '15px', marginBottom: '15px' }}>GRAND TOTAL = ${((
            this.state.itemsTotal +
            personnalTotal +
            (this.state.stageThree.length * 250.00) +
            (this.state.stageTwo.length * 500.00) +
            (this.state.stageOne.length * 1000.00)
          ) * 1.15).toFixed(2)}</b>
           <div style={{ fontSize: "12px", marginLeft: "14px", marginBottom: "25px" }}>%15 added to total for administrative costs</div>

       <Button onClick={this.previous.bind(this)} >Previous</Button> <Button onClick={this.submit.bind(this)} >Next</Button>
  </Col>
      </div>
    );
  }
}

const CostRecovery = Form.create()(CostRecoveryForm);

export default CostRecovery;