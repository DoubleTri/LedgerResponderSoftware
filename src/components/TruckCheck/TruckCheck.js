import React, { Component } from 'react';
import * as firebase from 'firebase';
import {  Form, Input, Button, Radio, message, Col } from 'antd';
import moment from 'moment';


import DirectorsNotes from './DirectorsNotes';

const FormItem = Form.Item;
var database = firebase.database();

class TruckCheckForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: this.props.admin,
      name: this.props.name,
      directorsNotes: null,
      pastChecks: null,
      last: null,
      truckChecks: {}
    };
  }

  componentDidMount() {

    // database.ref('directorsNotes/text').on('value', function (snap) {
    //   this.setState({ directorsNotes: snap.val() })
    //   }.bind(this));

      var arrTruck = []
      database.ref('truckCheck').on('value', function (snap) {
        arrTruck = []
      snap.forEach(function (check) {
        arrTruck.push(check.val())
      })
      this.setState({pastChecks: arrTruck})

      var dateArr = [];
      arrTruck.map((check) => {
        return dateArr.push(check)
      })
      this.setState({lastNotes: dateArr[dateArr.length - 1].truckCheck.Notes, lastCheckDate: moment(dateArr[dateArr.length - 1].date).format("MMMM D, YYYY") })
      this.props.form.setFieldsValue({previousNotes: dateArr[dateArr.length - 1].truckCheck.Notes})
      }.bind(this));  
      



  }

  onChange(key, e) {
    let truckCheck = Object.assign({}, this.state.truckCheck);  
    truckCheck[key] = e.target.value;                        
    this.setState({truckCheck});
  }

  save(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        var db = database.ref('truckCheck');
        var data = {
          date: new Date().toString(),
          truckCheck: this.state.truckCheck,
          submittedBy: this.state.name
        }
        db.push(data)
        this.props.form.resetFields()
        message.success('Truck Check Saved')
      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;
    const { TextArea } = Input;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <div style={{ minHeight: "78vh" }}>

      <Col xs={{ span: 20, offset: 2 }} sm={{ span: 12, offset: 6 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
      <h2>Truck Check</h2>
        <br />
        <h4>Special notes and instruction</h4>  
      <DirectorsNotes 
        // directorsNotes={this.state.directorsNotes? this.state.directorsNotes : 'loading...'} 
        admin={this.state.admin} 
      />

      <br />

      <Form onSubmit={this.save.bind(this)} className="TruckCheckForm">

      <FormItem {...formItemLayout} label='Previous Notes'>
      Last Truck Check {this.state.lastCheckDate}
          {getFieldDecorator('previousNotes', {
            rules: [{ required: false }],
          })(
            <TextArea
            disabled={true}
            rows={4}
              // onChange={this.onChange.bind(this, 'Previous Notes')}
            />  
            )}
        </FormItem>

      <FormItem {...formItemLayout} label="Fuel (above 90%)">
      {getFieldDecorator('Fuel', {
            rules: [{ required: true }],
          })(

      <RadioGroup onChange={this.onChange.bind(this, 'Fuel')}>
        <RadioButton value={true}>Ok</RadioButton>
        <RadioButton value={false}>Not Ok</RadioButton>
      </RadioGroup>
          )}
      </FormItem>

      <FormItem {...formItemLayout} label="Volts (14v)">
      {getFieldDecorator('Volts', {
            rules: [{ required: true }],
          })(

      <RadioGroup onChange={this.onChange.bind(this, 'Volts')}>
        <RadioButton value={true}>Ok</RadioButton>
        <RadioButton value={false}>Not Ok</RadioButton>
      </RadioGroup>
          )}
      </FormItem>

      <FormItem {...formItemLayout} label='Air Pressure Primary (above 120psi)'>
      {getFieldDecorator('Air Pressure Primary', {
            rules: [{ required: true }],
          })(

      <RadioGroup onChange={this.onChange.bind(this, 'Air Pressure Primary')}>
        <RadioButton value={true}>Ok</RadioButton>
        <RadioButton value={false}>Not Ok</RadioButton>
      </RadioGroup>
          )}
      </FormItem>

      <FormItem {...formItemLayout} label="Air Pressure Secondary (above 120psi)">
      {getFieldDecorator('Air Pressure Secondary', {
            rules: [{ required: true }],
          })(

      <RadioGroup onChange={this.onChange.bind(this, 'Air Pressure Secondary')}>
        <RadioButton value={true}>Ok</RadioButton>
        <RadioButton value={false}>Not Ok</RadioButton>
      </RadioGroup>
          )}
      </FormItem>

      <FormItem {...formItemLayout} label="Fuel Card">
      {getFieldDecorator('Fuel Card', {
            rules: [{ required: true }],
          })(

      <RadioGroup onChange={this.onChange.bind(this, 'Fuel Card')}>
        <RadioButton value={true}>Ok</RadioButton>
        <RadioButton value={false}>Not Ok</RadioButton>
      </RadioGroup>
          )}
      </FormItem>

      <FormItem {...formItemLayout} label='Trans Temp'>
          {getFieldDecorator('Trans Temp', {
            rules: [{ required: true }],
          })(
            <Input
              type='number'
              onChange={this.onChange.bind(this, 'Trans Temp')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Coolent Temp'>
          {getFieldDecorator('Coolent Temp', {
            rules: [{ required: true }],
          })(
            <Input
              type='number'
              onChange={this.onChange.bind(this, 'Coolent Temp')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Hours'>
          {getFieldDecorator('Hours', {
            rules: [{ required: true }],
          })(
            <Input
              type='number'
              onChange={this.onChange.bind(this, 'Hours')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Mileage'>
          {getFieldDecorator('Mileage', {
            rules: [{ required: true }],
          })(
            <Input
              type='number'
              onChange={this.onChange.bind(this, 'Mileage')}
            />  
            )}
        </FormItem>

          <FormItem {...formItemLayout} label='Headlights'>
            {getFieldDecorator('Headlights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Headlights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='High Beams'>
            {getFieldDecorator('High Beams', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'High Beams')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Running Lights'>
            {getFieldDecorator('Running Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Running Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Turn Signals'>
            {getFieldDecorator('Turn Signals', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Turn Signals')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Back Up Lights'>
            {getFieldDecorator('Back Up Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Back Up Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Ground Lights'>
            {getFieldDecorator('Ground Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Ground Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Compartment Lights'>
            {getFieldDecorator('Compartment Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Compartment Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Upper Warning Lights'>
            {getFieldDecorator('Upper Warning Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Upper Warning Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Left DC Scene Light'>
            {getFieldDecorator('Left DC Scene Light', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Left DC Scene Light')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Right DC Scene Light'>
            {getFieldDecorator('Right DC Scene Light', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Right DC Scene Light')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Drivers Side Tripod Light'>
            {getFieldDecorator('Drivers Side Tripod Light', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Drivers Side Tripod Light')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Inside Cab Lights'>
            {getFieldDecorator('Inside Cab Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Inside Cab Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Front Light Bar'>
            {getFieldDecorator('Front Light Bar', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Front Light Bar')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='four Way Flashers'>
            {getFieldDecorator('Four Way Flashers', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Four Way Flashers')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Side Strobes'>
            {getFieldDecorator('Side Strobes', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Side Strobes')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Rear Flashers'>
            {getFieldDecorator('Rear Flashers', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Rear Flashers')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Horns And Sirens'>
            {getFieldDecorator('Horns And Sirens', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Horns And Sirens')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Interior Step Lights'>
            {getFieldDecorator('Interior Step Lights', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Interior Step Lights')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Lower Warnings'>
            {getFieldDecorator('Lower Warnings', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Lower Warnings')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Rear DC Scene Light'>
            {getFieldDecorator('Rear DC Scene Light', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Rear DC Scene Light')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Light Tower'>
            {getFieldDecorator('Light Tower', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Light Tower')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Passenger Side Tripod Light'>
            {getFieldDecorator('Passenger Side Tripod Light', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Passenger Side Tripod Light')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Engine Oil'>
            {getFieldDecorator('Engine Oil', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Engine Oil')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Transmission'>
            {getFieldDecorator('Transmission', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Transmission')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Radiator'>
            {getFieldDecorator('Radiator', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Radiator')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Power Steering'>
            {getFieldDecorator('Power Steering', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Power Steering')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Amps Generator'>
            {getFieldDecorator('Amps Generator', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Amps Generator')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Stanley Power Unit - Fuel'>
            {getFieldDecorator('Stanley Power Unit - Fuel', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Stanley Power Unit - Fuel')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Stanley Power Unit - Oil'>
            {getFieldDecorator('Stanley Power Unit - Oil', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Stanley Power Unit - Oil')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Stanley Power Unit - Hydraulic Oil'>
            {getFieldDecorator('Stanley Power Unit - Hydraulic Oil', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Stanley Power Unit - Hydraulic Oil')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Honda Pump - Fuel'>
            {getFieldDecorator('Honda Pump - Fuel', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Honda Pump - Fuel')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Honda Pump - Oil'>
            {getFieldDecorator('Honda Pump - Oil', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Honda Pump - Oil')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Portable Radios'>
            {getFieldDecorator('Portable Radios', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Portable Radios')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Recon II Search Cam'>
            {getFieldDecorator('Recon II Search Cam', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Recon II Search Cam')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Delsar Devices'>
            {getFieldDecorator('Delsar Devices', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Delsar Devices')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Sked'>
            {getFieldDecorator('Sked', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Sked')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='300ft Rope Bag (4)'>
            {getFieldDecorator('300ft Rope Bag (4)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '300ft Rope Bag (4)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Azteck Pro Kits (6)'>
            {getFieldDecorator('Azteck Pro Kits (6)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Azteck Pro Kits (6)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Portable Air Compressor'>
            {getFieldDecorator('Portable Air Compressor', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Portable Air Compressor')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Palm Nailer'>
            {getFieldDecorator('Palm Nailer', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Palm Nailer')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='10 1/4 Circular Saw'>
            {getFieldDecorator('10 Circular Saw', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '10 Circular Saw')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Tripod'>
            {getFieldDecorator('Tripod', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Tripod')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='PPE Gear Bag'>
            {getFieldDecorator('PPE Gear Bag', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'PPE Gear Bag')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='H2O Pump'>
            {getFieldDecorator('H2O Pump', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'H2O Pump')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='45lb Breaker'>
            {getFieldDecorator('45lb Breaker', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '45lb Breaker')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='19lb Hammer Drill'>
            {getFieldDecorator('19lb Hammer Drill', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '19lb Hammer Drill')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Hydraulic Hose (9)'>
            {getFieldDecorator('Hydraulic Hose (9)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Hydraulic Hose (9)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Box Lights (6)'>
            {getFieldDecorator('Box Lights (6)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Box Lights (6)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Super Probe Search Cam'>
            {getFieldDecorator('Super Probe Search Cam', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Super Probe Search Cam')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Stokes Baskets (2)'>
            {getFieldDecorator('Stokes Baskets (2)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Stokes Baskets (2)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Pre-Rigged M/A '>
            {getFieldDecorator('Pre-Rigged MA ', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Pre-Rigged MA ')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Rigging Bags (2)'>
            {getFieldDecorator('Rigging Bags (2)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Rigging Bags (2)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Harness Bags (9)'>
            {getFieldDecorator('Harness Bags (9)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Harness Bags (9)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Pasloads'>
            {getFieldDecorator('Pasloads', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Pasloads')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='50ft Air Hoses (4)'>
            {getFieldDecorator('50ft Air Hoses (4)', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '50ft Air Hoses (4)')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='8 1/4 Circular Saw'>
            {getFieldDecorator('8 Circular Saw', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '8 Circular Saw')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Con Space Blowers'>
            {getFieldDecorator('Con Space Blowers', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Con Space Blowers')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Hydraulic Chain Saw'>
            {getFieldDecorator('Hydraulic Chain Saw', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Hydraulic Chain Saw')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Hydraulic Circular Saw'>
            {getFieldDecorator('Hydraulic Circular Saw', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Hydraulic Circular Saw')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='87lb Breaker'>
            {getFieldDecorator('87lb Breaker', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '87lb Breaker')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='45lb Hammer Drill'>
            {getFieldDecorator('45lb Hammer Drill', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '45lb Hammer Drill')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Drill Bit/Chisel Bit Box'>
            {getFieldDecorator('Drill Bit Chisel Bit Box', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Drill Bit Chisel Bit Box')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='5 Hour Battery Packs Charged'>
            {getFieldDecorator('5 Hour Battery Packs Charged', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '5 Hour Battery Packs Charged')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='2 Hour Battery Packs Charged'>
            {getFieldDecorator('2 Hour Battery Packs Charged', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, '2 Hour Battery Packs Charged')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Battery Packs Charged'>
            {getFieldDecorator('Battery Packs Charged', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Battery Packs Charged')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Portable Radios Charged'>
            {getFieldDecorator('Portable Radios Charged', {
              rules: [{ required: true }],
            })(

              <RadioGroup onChange={this.onChange.bind(this, 'Portable Radios Charged')}>
                <RadioButton value={true}>Ok</RadioButton>
                <RadioButton value={false}>Not Ok</RadioButton>
              </RadioGroup>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Notes'>
          {getFieldDecorator('Notes', {
            rules: [{ required: false }],
          })(
            <TextArea
            rows={4}
              onChange={this.onChange.bind(this, 'Notes')}
            />  
            )}
        </FormItem>



      <br />

      <hr />

      <Button htmlType="submit">Save</Button>
      </Form>
</Col>
    </div>
    )
  }
}

const TruckCheck = Form.create()(TruckCheckForm);

export default TruckCheck;