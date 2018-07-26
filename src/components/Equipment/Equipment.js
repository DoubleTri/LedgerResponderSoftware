import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Button, Input, Icon, InputNumber, DatePicker, Col, Row, Select, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import dateFormat from 'dateformat'

const FormItem = Form.Item;
var database = firebase.database();


class CostRecoveryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      open: false,
    };
  }

  componentDidMount() {
    var that = this;
    var addItem = [];
    database.ref('equipmentCal/').on("value", function (snap) {
      addItem = [];
      snap.forEach(function (data) {
        that.setState({ key: data.key })
        database.ref('equipmentCal/' + data.key).once('value', function (snap) {
          addItem.push(snap.val())
        })
      })
      that.setState({ addItem })
    })
  }

  sendToFunctions(addItem) {
    console.log(addItem)
    var that = this;
    var equipment = firebase.functions().httpsCallable('equipment');

    equipment({
      obj: addItem
    }).catch(function (error) {
        console.log(error)
      });
  }

  addItem(e) {
    e.preventDefault()
    var that = this;
    var equipment = firebase.functions().httpsCallable('equipment');

    var equipmentAdded = that.props.form.getFieldValue('equipment')
    var interval = this.state.interval
    var intervalMs = this.state.intervalMs
    var nextCal= moment.utc(that.props.form.getFieldValue('date')).valueOf() + this.state.intervalMs
    var date = this.state.date
    var dateMs = moment.utc(that.props.form.getFieldValue('date')).valueOf()
    var contact = that.props.form.getFieldValue('contact')

    that.setState({
      addItem: that.state.addItem ? that.state.addItem.concat([{ equipmentAdded, date, dateMs, interval, intervalMs, contact, nextCal }]) : [{ equipmentAdded, date, dateMs, interval, intervalMs, contact, nextCal }],
    })

    that.props.form.validateFields((err, values) => {
      if (!err) {

        var item = {
          equipment: equipmentAdded,
          date: date,
          interval: interval,
          nextCal: nextCal,
          intervalMs: intervalMs,
          dateMs: dateMs,
          contact: contact
        }
        database.ref('equipmentCal/').push(item).then(() => {
          that.sendToFunctions(that.state.addItem)
        })
        that.close()
        that.props.form.resetFields()
      }
    })
  }

  delete(equipment) {
    var newState = this.state.addItem.filter(x => x.equipment !== equipment);
    this.setState({ 
      addItem: newState,  
    })

    this.sendToFunctions(newState)

    var that = this
    var key = '';

    database.ref('equipmentCal').orderByChild('equipment').equalTo(equipment).once("value", function (snap) {

      snap.forEach(function (data) {
        key = data.key
      });

      database.ref('equipmentCal/' + key).remove();
    })
  }

  onChangeEquipment(e){
    this.setState({ equipment: e.target.value})
  }

  onChangeDate(key, dateObj, dateString) {
    this.setState({ date: dateString }) 
    console.log(dateObj)
  }

  onChangeInterval(e) {
    var num;
    if(e === '30 Days'){
      num = 2592000000
    }else if(e === '60 Days'){
      num = 5184000000
    }else if(e === '90 Days'){
      num = 7776000000
    }else if(e === '6 Months'){
      num = 15768000000
    }else if(e === '9 Months'){
      num = 23652000000
    }else if(e === '1 Year'){
      num = 31536000000
    }
    this.setState({ interval: e, intervalMs: num })
  }

  onChangeContact(e) {
    this.setState({ contact: e})
  }

  calComplete(equipment, dateObj, dateString) {
    console.log(new Date(dateString).getTime())
    var that = this;
    var newDate = new Date(dateString).getTime();
    var key = '';
    var newCalDate;

    database.ref('equipmentCal').orderByChild('equipment').equalTo(equipment).once("value", function (snap) {
      snap.forEach(function (data) {
        key = data.key
      });
      database.ref('equipmentCal/' + key).once('value', function(snap) {
        console.log(newDate + snap.child('intervalMs').val())
        newCalDate = newDate + snap.child('intervalMs').val()
      }).then(() => {
        that.setState({addItem: that.state.addItem.map(
          (el) => Object.assign( {}, el, {nextCal: newCalDate}) )
        })
        database.ref('equipmentCal/' + key).update({nextCal: newCalDate, date: dateString, dateMs: newDate})
      }).then(() => {
        that.sendToFunctions(that.state.addItem)
      })
      
    })
  }

  open() {
    this.setState({ open: true })
  }

  close() {
    this.setState({ open: false })
  }

  render() {
    
    var items = this.state.addItem && this.state.addItem.length > 0 ? 
      this.state.addItem.map((item, i) => {
        return <li key={i}>
        <Row type="flex" justify="center">
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 3 }}><b>Equipment: </b><p>{item.equipment}</p></Col> 
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 3 }}><b>Last Calibrated: </b><p>{item.date}</p></Col> 
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 3 }}><b>Next Calibration: </b><p>{dateFormat(new Date(item.nextCal), "mmmm d, yyyy")}</p></Col>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 6 }}><DatePicker format="MMMM D, YYYY" placeholder="Completed" size='small' onChange={this.calComplete.bind(this, item.equipment)} />
        <Popconfirm title={"Are you sure you'd like to delete " + item.equipment + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this, item.equipment )}>
        <Icon style={{ marginLeft: '20px', color: '#C84747', float: 'right' }} type="close-circle-o" />
        </Popconfirm>
        </Col>
        </Row>
        <hr/>
        </li>
      })
      :
      'No items added'
    
    const { getFieldDecorator } = this.props.form;
  
    return (
      <div>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }}>
        <h2>Equipment Calibration Log</h2>
          <Button style={{ marginBottom: '2em' }} onClick={this.open.bind(this)}>Add Equipment</Button>

          <ul>{items}</ul>

          <Modal
            title='Add Equipment'
            visible={this.state.open}
            onCancel={this.close.bind(this)}
            maskClosable={false}
            footer={null}
          >
            <Form onSubmit={this.addItem.bind(this)} className="equipmentForm">

              <FormItem>
                {getFieldDecorator('equipment', {
                  rules: [{ required: true }, { max: 100 }],
                })(
                  <Input onChange={this.onChangeEquipment.bind(this)} placeholder="Equipment" />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('date', {
                  rules: [{ required: true }],
                })(
                  <DatePicker format="MMMM D, YYYY" placeholder="Last Calibration Date" onChange={this.onChangeDate.bind(this, 'date')} />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('interval', {
                  rules: [{ required: true }],
                })(
                  <Select
                    style={{ width: '90%', float: 'left' }}
                    placeholder='Time Intervals'
                    onChange={this.onChangeInterval.bind(this)}
                  >
                    <Select.Option value="30 Days">30 Days</Select.Option>
                    <Select.Option value="60 Days">60 Days</Select.Option>
                    <Select.Option value="90 Days">90 Days</Select.Option>
                    <Select.Option value="6 Months">6 Months</Select.Option>
                    <Select.Option value="9 Months">9 Months</Select.Option>
                    <Select.Option value="1 Year">1 Year</Select.Option>
                  </Select>
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('contact', {
                  rules: [{ required: true }],
                })(
                  <Select
                    style={{ width: '90%', float: 'left' }}
                    placeholder='Contact'
                    onChange={this.onChangeContact.bind(this)}
                  >
                    <Select.Option value="ryanr1423@yahoo.com">ryanr1423@yahoo.com</Select.Option>
                    <Select.Option value="ryanr1423@gmail.com">ryanr1423@gmail.com</Select.Option>
                    <Select.Option value="riebenr@pittsfield-mi.gov">riebenr@pittsfield-mi.gov</Select.Option>
                  </Select>
                )}
              </FormItem>

              <Button htmlType="submit">Submit Item</Button>
              <Button onClick={this.close.bind(this)}>Close</Button>

            </Form>
          </Modal>



        </Col>
      </div>
    );
  }
}

const CostRecovery = Form.create()(CostRecoveryForm);

export default CostRecovery;