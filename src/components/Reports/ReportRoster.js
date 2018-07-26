import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, Select, Col, message } from 'antd';
import NameForms from '../TeamRoster/NameForms';

var database = firebase.database();

class ReportRoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runNumber: this.props.getStore().runNumber,
      reportKey: this.props.getStore().reportKey,
      incidentType: this.props.getStore().incidentType,
      date: this.props.getStore().date,
      uid: this.props.getStore().uid,
      members: null,
      presentMembers: null,
    };
  }

  componentDidMount() {
    var that = this;
    var team = []
    var rosterKey = ''

    console.log(this.props.getStore())

    if (!this.props.getStore().presentMembers) {
      database.ref('users').once('value', function (snap) {
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
        that.setState({ members: objs, users: alpha })
      })

    } else {
      this.setState({
        members: this.props.getStore().members,
        presentMembers: this.props.getStore().presentMembers,
        fromProps: true
      })
      database.ref('rosters').orderByChild('uid').equalTo(this.props.getStore().uid).on('value', function (snap) {
        snap.forEach(function (data) {
          rosterKey = data.key
        })
        that.setState({ rosterKey })
      })
    }

    if(!this.props.getStore().apparatus) {
      this.setState({ 
        apparatus : [
          {truck: '17-1', checked: false},
          {truck: '17-2', checked: false},
          {truck: '17-3', checked: false},
          {truck: '17-4', checked: false},
          {truck: '17-5', checked: false},
          {truck: '17-6', checked: false},
          {truck: 'Trailer 1 (PTFD)', checked: false},
          {truck: 'Trailer 2 (AAFD)', checked: false},
          {truck: 'WCTRT Boat', checked: false},
        ]
      })
    }else{
      this.setState({ apparatus: this.props.getStore().apparatus })
    }
  }

  change(index, e, members) {
    let newItems = members.slice();
    newItems[index].checked = !newItems[index].checked

    var db = []
    newItems.map((here) => {
      if (here.checked === true) {
        db.push(here.member)
      }
      return true
    })

    this.setState({
      members: newItems,
      presentMembers: db
    })
    this.props.updateStore({
      members: newItems,
      presentMembers: db
    });  
  }

  changeApparatus(index, e, trucks) {
    let newItems = this.state.apparatus.slice();
    newItems[index].checked = !newItems[index].checked

    var db = []
    newItems.map((here) => {
      if (here.checked === true) {
        db.push(here.truck)
      }
      return true
    })

    this.setState({
      apparatus: newItems,
      presentApparatus: db
    })
    this.props.updateStore({
      apparatus: newItems,
      presentApparatus: db
    }); 
  }

  onChangeSelect(truck, e) {
    console.log(e + truck)
    this.setState({apparatus: this.state.apparatus.map(
      (el)=> el.truck === truck ? Object.assign({}, el, {stage: e}) : el )
    })
    this.props.updateStore({apparatus: this.state.apparatus.map(
      (el)=> el.truck === truck ? Object.assign({}, el, {stage: e}) : el )
    })
  }

  previous() {
    return this.props.jumpToStep(1)
  }
  
  submit() {
    var that = this

    if (this.props.getStore().presentApparatus 
      && this.props.getStore().presentApparatus.length > 0
      && this.props.getStore().presentMembers
      && this.props.getStore().presentMembers.length > 0) {

      var reportData = {
        members: that.state.members,
        presentMembers: that.state.presentMembers,
        apparatus: this.props.getStore().apparatus,
        presentApparatus: this.props.getStore().presentApparatus
      }
      database.ref('reports/' + this.state.reportKey).update(reportData)

      // Roster Data to DB

      var rosterData = {
        type: this.props.getStore().incidentType,
        date: this.props.getStore().date,
        presentMembers: this.props.getStore().members,
        description: this.props.getStore().incidentType + ': ' + this.props.getStore().date,
        uid: this.props.getStore().uid,
        members: this.props.getStore().presentMembers,
      }

      if (this.state.fromProps) {
        database.ref('rosters/' + this.state.rosterKey).update(rosterData)
        return that.props.jumpToStep(3)
      } else {
        var firebaseRef = database.ref('rosters')
        firebaseRef.push(rosterData)
        return that.props.jumpToStep(3)
      }

    } else {
      message.error('Apparatus and Personnel must be fill out')
    }
  }
 
  render() {

    return (
      <div>
<Col xs={{ span: 18, offset: 2 }} sm={{ span: 14, offset: 8 }} style={{ marginTop: '1em' }} >
<h2>Report Roster</h2>
          {this.state.members ? <NameForms
            members={this.state.members}
            change={this.change.bind(this)}
            name="presentMembers"
            value={this.state.presentMembers}
          /> : 'loading...'}

<br />
           <h2>Apparatus On Scene</h2>  
            
            <br />

        {this.state.apparatus ?
          <ul>
            {this.state.apparatus.map((item, i) =>
              <li key={i}>
                <input type="checkbox" disabled={this.props.disabled}
                  onChange={this.changeApparatus.bind(this, i)}
                  defaultChecked={item.checked === true ? true : false}
                />
                {item.truck} {item.checked === true ? <Select
                                defaultValue={item.stage}
                                style={{ width: '25%', marginLeft: '15px' }}
                                onChange={this.onChangeSelect.bind(this, item.truck)}
                            >
                                <Select.Option value="Stage 1">Stage 1</Select.Option>
                                <Select.Option value="Stage 2">Stage 2</Select.Option>
                                <Select.Option value="Stage 3">Stage 3</Select.Option>
                            </Select> : null }
              </li>
            )}
          </ul>
          : 'loading....'}

            <Button onClick={this.previous.bind(this)}>Previous</Button> <Button onClick={this.submit.bind(this)}>Next</Button>

</Col>
      </div>
    )
  }
}


export default ReportRoster;