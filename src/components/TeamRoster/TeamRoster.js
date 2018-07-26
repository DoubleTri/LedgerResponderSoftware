import React, { Component } from 'react';

import * as firebase from 'firebase';
import { Form, Modal, Button, message, Spin, DatePicker, Select, Input, Popconfirm, Col } from 'antd';
import NameForms from './NameForms';

const Option = Select.Option;


const FormItem = Form.Item;
var database = firebase.database();

class TeamRosterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: this.props.admin,
      members: null,
      rosterMembers: null,
      presentMembers: null,
      date: null,
      type: null,
      description: null,
      editRoster: null,
      showEdit: false,
      presentMembersEdit: null,
      key: null
    };
  }

  componentWillMount() {
    var rosterArr = []
    database.ref('rosters').on('value', function (snap) {
      rosterArr = []
      snap.forEach(function (item) {
        rosterArr.push(item.val())
      })
      this.setState({rosters: rosterArr})
      this.memberReset()
    }.bind(this))
  }

  memberReset() {
    var team = []
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
      this.setState({ members: objs, users: alpha })
    }.bind(this));
  }

  change(index, e, members) {
    let newItems = members.slice();
    newItems[index].checked = !newItems[index].checked
    this.setState({
      presentMembers: newItems
    })
  }

  submit(e) {

    var that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        var db = []
        this.state.presentMembers.map((here) => {
          if (here.checked === true) {
            return db.push(here.member)
          }
          return true
        })

        var firebaseRef = database.ref('rosters')
        var data = {
          type: this.state.type,
          date: this.state.date,
          presentMembers: this.state.presentMembers,
          description: this.state.description,
          uid: Date.now(),
          members: db
        }
        firebaseRef.push(data).then(function () {
          message.success('Roster submitted successfully');
          that.props.form.resetFields()
        }).catch(function (error) {
          console.log(error);
        })
        //parent.scrollTo(0, 0); return true
        
      }
    })
    this.memberReset()
  }

  descriptionEditChange(e) {
    this.setState({
      editDescription: e.target.value
    })
  }

  dateChange(e, date) {
    this.setState({date})
  }

  typeOfEventChange(e) {
    this.setState({type: e})
  }

  descriptionChange(e) {
    this.setState({description: e.target.value})
  }

  closeEdit() {
    this.setState({ showEdit: false, editRoster: null })
    this.props.form.resetFields()
  }

  noEditChange() {
    message.warning('Must be admin to edit rosters')
  }

  pastRostersChange(value) {
    var that = this;
    var key = '';

    database.ref('rosters').orderByChild('uid').equalTo(value).on('value', function (snap) {
      snap.forEach(function (data) {
        key = data.key
      })
      database.ref('rosters/' + key).once('value', function(snap){
        that.setState({
          editRoster: snap.val(),
          presentMembersEdit: snap.child('presentMembers').val(),
          editDescription: snap.child('description').val(),
          showEdit: true,
          key: key
        })
      })
    })
  }

  editChange(index, e, members) {
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
      presentMembersEdit: newItems, members: db
    })
  }

  submitEdit() {
    var newData = {
      presentMembers: this.state.presentMembersEdit,
      members: this.state.members,
      description: this.state.editDescription
    }
    database.ref('rosters/' + this.state.key).update(newData)
    this.closeEdit()
  }

  delete() {
    message.success('Roster deleted.')
    database.ref('rosters/' + this.state.key).remove();
    this.closeEdit()
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { size } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const children = [];

    return (
      <div>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
          <h2>Team Roster</h2>
          {this.state.members && this.state.rosters ?
            <div>

              {this.state.rosters.map((date) => {
                children.push(<Option key={date.uid} value={date.uid}>{date.type}:&nbsp;&nbsp;&nbsp;{date.date}</Option>)
                return true
              })}

            <FormItem
              {...formItemLayout}
              label='Past Rosters'
            >
            {getFieldDecorator('pastRosters', {
                rules: [{ required: false }],
              })(
            <Select
              style={{ width: '90%', float: 'left' }}
              placeholder='Past Rosters'
              onChange={this.pastRostersChange.bind(this)}
            >
              {children}
            </Select>
              )}
            </FormItem>
          
          <hr />

        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }}>   
          <h3>Create new roster</h3>
        </Col>

          <Form onSubmit={this.submit.bind(this)} className="createEventForm">

            <FormItem
              {...formItemLayout}
              label='date'
            >
              {getFieldDecorator('date', {
                rules: [{ type: 'object', required: true, message: 'Please select a date' }],
              })(
                <DatePicker format="MMMM D, YYYY" onChange={this.dateChange.bind(this)} />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label='Type of Event'>
          {getFieldDecorator('typeOfEvent', {
            rules: [{ required: true, message: 'Please select the type of event' }],
          })(
              <Select
                size={size}
                style={{ width: '75%' }}
                onChange={this.typeOfEventChange.bind(this)}
              >
                <Select.Option value="Monthly Training - TRT">Monthly Training - TRT</Select.Option>
                <Select.Option value="Monthly Training - H2O">Monthly Training - H2O</Select.Option>
                <Select.Option value="Specialized Training">Specialized Training</Select.Option>
                <Select.Option value="Truck Check">Truck Check</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Event Description'>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please describe the event' }],
          })(
            <Input
              onChange={this.descriptionChange.bind(this)}
            />
            )}
        </FormItem>
        <Col xs={{ span: 18, offset: 2 }} sm={{ span: 14, offset: 8 }} style={{ marginTop: '1em' }} > 
            <div><NameForms change={this.change.bind(this)} members={this.state.members} /></div>

            <Button htmlType="submit">Submit Roster</Button>
        </Col>
          </Form>
          
          </div>
          :
          <Spin tip="Loading..." size="large" />
        }


{/* Edit Roster Modal */}
        <Modal
          title={this.state.editRoster? this.state.editRoster.type +':    ' + this.state.editRoster.date  : ''}
          visible={this.state.showEdit}
          onCancel={this.closeEdit.bind(this)}
          footer={null}
        >

          {this.state.editRoster ?

          !this.state.admin? <div>
                Description:
            <Input
                  style={{ marginBottom: '15px' }}
                  disabled={true}
                  value={this.state.editDescription}
                /> 
          <NameForms
          members={this.state.editRoster.presentMembers}
          disabled={true} 
          />
          </div>
          :
            this.state.admin 
              && this.state.editRoster.type === 'Monthly Training - TRT' 
              || this.state.editRoster.type === 'Monthly Training - H2O'
              || this.state.editRoster.type === 'Specialized Training' 
              || this.state.editRoster.type === 'Truck Check'? <div>

            Description:
            <Input
              style={{ marginBottom: '15px' }}
              onChange={this.descriptionEditChange.bind(this)}
              value={this.state.editDescription}
            />            
 
            <NameForms
              members={this.state.editRoster.presentMembers}
              change={this.editChange.bind(this)}
            />

            <Button onClick={this.submitEdit.bind(this)}>Submit Edits</Button>
              <Popconfirm title={'Are you sure you want to delete this roster?'} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
                <Button>Delete</Button>
              </Popconfirm>
            
            </div>

            :         
              this.state.editRoster.type !== 'Training - TRT' 
              || this.state.editRoster.type !== 'Training - H2O' 
              || this.state.editRoster.type !== 'Truck Check' ? <div> 

                <h5 style={{ color: '#C84747' }} >This roster is attached to a report.  Any changes must be done from the reports page.</h5>
                <NameForms
                members={this.state.editRoster.presentMembers}
                disabled={true} 
                />
                </div>
                :
                null
          : 'Loading...'}
          <Button onClick={this.closeEdit.bind(this)}>Close</Button>

        </Modal>
        </Col>
      </div>
    )
  }
}

const TeamRoster = Form.create()(TeamRosterForm);

export default TeamRoster;