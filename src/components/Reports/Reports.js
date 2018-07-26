import React, { Component } from 'react';
import { auth, storage } from '../firebase';
import * as firebase from 'firebase';
import { Link } from "react-router-dom";
import { Form, Input, Button, Select, DatePicker, TimePicker, Checkbox, Modal, message } from 'antd';
import moment from 'moment';

import NameForms from '../TeamRoster/NameForms';
import ReportPhotos from './ReportPhotos';

const FormItem = Form.Item;
const confirm = Modal.confirm;

var database = firebase.database();
var storageRef = storage.ref();

class ReportsFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiDay: false,
      show: false,
      uid: Date.now(),
      name: this.props.name,
      admin: this.props.admin,
      members: this.props.members,
      pastReports: this.props.pastReports,
      runNumber: null,
      incidentLocation: null, 
      activationTime: null,
      arrivalTime: null,
      serviceTime: null,
      requesting: null, 
      incidentType: null,
      initialActions: null,
      sustainedActions: null, 
      termination: null,
      presentMembers: null,
      loadedFile: [],
      fileName: []
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({ name: this.state.name })
  }

  onChangeDate(key, dateObj, dateString) {
    this.setState({ [key]: dateString })
  }

  onChangeText(key, e) {
    this.setState({ [key]: e.target.value })
  }

  onChangeSelect(key, e) {
    this.setState({ [key]: e })
  }

  multiDay() {
    this.setState({ multiDay: !this.state.multiDay })
  }

  change(index, e, members) {
    let newItems = members.slice();
    newItems[index].checked = !newItems[index].checked

    var db = []
    newItems.map((here) => {
      if (here.checked === true) {
        db.push(here.member)
      }
    })

    this.setState({
      members: newItems,
      presentMembers: db
    })
  }

  open() {
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false })
  }

  // store(e) {
  //   console.log(e.target.files[0].name)
  //   this.setState({ 
  //     loadedFile: this.state.loadedFile.concat([e.target.files[0]]), 
  //     fileName: this.state.fileName.concat([e.target.files[0].name]) 
  //   })
  //   }
  

  submit(e) {
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {

// Report Data to DB

        var db = database.ref('reports');
        var reportData = {
          date: this.state.date,
          multiDay: this.state.multiDay,
          name: this.state.name,
          runNumber: this.state.runNumber,
          incidentLocation: this.state.incidentLocation,
          activationTime: this.state.date + ' ' + this.state.activationTime,
          arrivalTime: this.state.multiDay ? this.state.arrivalTime : this.state.date + ' ' + this.state.arrivalTime,
          serviceTime: this.state.multiDay ? this.state.arrivalTime : this.state.date + ' ' + this.state.serviceTime,
          requesting: this.state.requesting,
          incidentType: this.state.incidentType,
          initialActions: this.state.initialActions,
          sustainedActions: this.state.sustainedActions,
          termination: this.state.termination,
          members: this.state.members,
          presentMembers: this.state.presentMembers,
          uid: this.state.uid
        }
        db.push(reportData)

// Roster Data to DB

        var firebaseRef = database.ref('rosters')
        var rosterData = {
          type: this.state.incidentType,
          date: this.state.date,
          presentMembers: this.state.members,
          description: this.state.incidentType + ': ' + this.state.date,
          uid: this.state.uid,
          members: this.state.presentMembers
        }
        firebaseRef.push(rosterData)



// Photo data to bucket and URL to DB

        // var that = this;
        // var key = '';
        // var photoObj = [];

        // this.state.loadedFile.map((photo) => {
        //   var name = photo.name
        //   storage.ref(that.state.runNumber + '/' + name).put(photo).on("state_changed", function (snap) {
        //     var percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        //     if (percentage === 100) {
        //       storageRef.child(that.state.runNumber + '/' + name).getDownloadURL().then(function (url) {
        //         console.log(url)

        //         photoObj.push({ name: name, url: url })

        //         database.ref('reports').orderByChild('runNumber').equalTo(that.state.runNumber).once("value", function (snap) {
        //           snap.forEach(function (data) {
        //             key = data.key
        //           });

        //           database.ref('reports/' + key + '/URLs').set(photoObj);
        //         })
        //       });
        //     }
        //   })

        // })

        this.props.form.resetFields();

        confirm({
          title: 'Would you like to see cost recovery calculations for this report?',

          onOk() {
            that.props.history.push(`/cost-recovery/${that.state.runNumber}`)
          },
          onCancel() {
            null
          },
        });

      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { size } = this.props;
    const { TextArea } = Input;

    return (
      <div>
        <Form onSubmit={this.submit.bind(this)} className="createReportForm">

        <Button onClick={this.open.bind(this)}>Past Reports</Button>

          <FormItem label='Date'>
            {getFieldDecorator('date', {
              rules: [{ required: true }],
            })(
              <DatePicker format="MMMM D, YYYY" onChange={this.onChangeDate.bind(this, 'date')} />
              )}
          </FormItem>

          <FormItem label='Report Completed By'>
            {getFieldDecorator('name', {
              rules: [{ required: false }],
            })(
              <Input
                onChange={this.onChangeText.bind(this, 'name')}
              />
              )}
          </FormItem>

          <FormItem label='Incident Location'>
            {getFieldDecorator('incidentLocation', {
              rules: [{ required: false }],
            })(
              <Input
                onChange={this.onChangeText.bind(this, 'incidentLocation')}
              />
              )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('newDay', {
              valuePropName: 'checked',
            })(
              <Checkbox onChange={this.multiDay.bind(this)}>Multi-Day Incidnet?</Checkbox>
              )}
          </FormItem>

          <FormItem label='Activation Time'>
            {getFieldDecorator('activationTime', {
              rules: [{ required: false }],
            })(
              <TimePicker
                onChange={this.onChangeDate.bind(this, 'activationTime')}
              />
              )}
          </FormItem>

          {this.state.multiDay ? <div>

            <FormItem label='Arrival Date and Time'>
              {getFieldDecorator('arrivalTime', {
                rules: [{ required: false }],
              })(
                <DatePicker showTime={true} format="MMMM D, YYYY HH:mm:ss" onChange={this.onChangeDate.bind(this, 'arrivalTime')} />
                )}
            </FormItem>

            <FormItem label='In Service Date and Time'>
              {getFieldDecorator('serviceTime', {
                rules: [{ required: false }],
              })(
                <DatePicker showTime={true} format="MMMM D, YYYY HH:mm:ss" onChange={this.onChangeDate.bind(this, 'serviceTime')} />
                )}
            </FormItem>

          </div>
            :

            <div>
              <FormItem label='Arrival Time'>
                {getFieldDecorator('arrivalTime', {
                  rules: [{ required: false }],
                })(
                  <TimePicker
                    onChange={this.onChangeDate.bind(this, 'arrivalTime')}
                  />
                  )}
              </FormItem>

              <FormItem label='In Service Time'>
                {getFieldDecorator('serviceTime', {
                  rules: [{ required: false }],
                })(
                  <TimePicker
                    onChange={this.onChangeDate.bind(this, 'serviceTime')}
                  />
                  )}
              </FormItem>
            </div>
          }

          <FormItem label='Requesting Fire Dept'>
            {getFieldDecorator('requesting', {
              rules: [{ required: false }],
            })(
              <Input
                onChange={this.onChangeText.bind(this, 'requesting')}
              />
              )}
          </FormItem>

          <FormItem label='Run Number'>
            {getFieldDecorator('runNumber', {
              rules: [{ required: true }],
            })(
              <Input
                onChange={this.onChangeText.bind(this, 'runNumber')}
              />
              )}
          </FormItem>

          <FormItem label='Incident Type'>
            {getFieldDecorator('incidentType', {
              rules: [{ required: false }],
            })(
              <Select
                size={size}
                style={{ width: '50%' }}
                onChange={this.onChangeSelect.bind(this, 'incidentType')}
              >
                <Select.Option value="Water Rescue">Water Rescue</Select.Option>
                <Select.Option value="Confined Space">Confined Space</Select.Option>
                <Select.Option value="Rope Rescue">Rope Rescue</Select.Option>
                <Select.Option value="Trench Rescue">Trench Rescue</Select.Option>
                <Select.Option value="Building Collapse">Building Collapse</Select.Option>
                <Select.Option value="Vehicle Extrication">Vehicle Extrication</Select.Option>
                <Select.Option value="Grain Bin Rescue">Grain Bin Rescue</Select.Option>
                <Select.Option value="Other">Other</Select.Option>

              </Select>
              )}
          </FormItem>

          <FormItem label='Initial Actions'>
            {getFieldDecorator('initialActions', {
              rules: [{ required: false }],
            })(
              <TextArea
                onChange={this.onChangeText.bind(this, 'initialActions')}
              />
              )}
          </FormItem>

          <FormItem label='Sustained Actions'>
            {getFieldDecorator('sustainedActions', {
              rules: [{ required: false }],
            })(
              <TextArea
                onChange={this.onChangeText.bind(this, 'sustainedActions')}
              />
              )}
          </FormItem>

          <FormItem label='Termination'>
            {getFieldDecorator('termination', {
              rules: [{ required: false }],
            })(
              <TextArea
                onChange={this.onChangeText.bind(this, 'termination')}
              />
              )}
          </FormItem>

          {this.state.members ? <NameForms
            members={this.state.members}
            change={this.change.bind(this)}
            name="presentMembers"
            value={this.state.presentMembers}
          /> : 'loading...'}

            <hr /> 

          <Photos uid={this.state.uid} />    

          {/* <div className="image-upload">
            <label htmlFor="file-input">
              <a>{this.state.uploadLabel ? 'Upload Photo' : null}</a>
            </label>
            <input id="file-input" type="file" onChange={this.store.bind(this)} />
          </div> */}

          <Button htmlType="submit">Submit</Button>


        </Form>

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
    )
  }
}

const Reports = Form.create()(ReportsFrom);

export default Reports;