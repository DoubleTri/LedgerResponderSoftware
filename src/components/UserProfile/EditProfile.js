import React, { Component } from 'react';
import * as firebase from 'firebase';
import {  Form, Input, Button, Select, message, Tooltip, Icon, notification } from 'antd';

const FormItem = Form.Item;

var database = firebase.database();

class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      member: this.props.member
    };
  }

  componentDidMount() {
    this.openNotification()
      var that = this;
      database.ref('users/' + this.props.userId).once('value', function (snap) {
        that.setState({
          member: snap.val(),
          email: snap.child('email').val()
        });
        that.props.form.setFieldsValue({
          name: snap.child('name').val(),
          email: snap.child('email').val(),
          phone: snap.child('phone').val(),
          department: snap.child('department').val(),
          emergencyContact: snap.child('emergencyContact').val(),
          relationship: snap.child('relationship').val(),
          emergencyPhone: snap.child('emergencyPhone').val(),
          emergencyAddress: snap.child('emergencyAddress').val(),
          medicalLicense: snap.child('medicalLicense').val(),
          firefighter: snap.child('firefighter').val(),
          fireOfficer: snap.child('fireOfficer').val(),
          staffAndCommand: snap.child('staffAndCommand').val(),
          ICS: snap.child('ICS').val(),
          UICS: snap.child('UICS').val(),
          RIT: snap.child('RIT').val(),
          hazardousMaterials: snap.child('hazardousMaterials').val(),
          swiftWater: snap.child('swiftWater').val(),
          ropeRescue: snap.child('ropeRescue').val(),
          towerRescue: snap.child('towerRescue').val(),
          confinedSpace: snap.child('confinedSpace').val(),
          trenchRescue: snap.child('trenchRescue').val(),
          structuralCollapse: snap.child('structuralCollapse').val(),
          iceRescue: snap.child('iceRescue').val(),
          openWaterRescue: snap.child('openWaterRescue').val(),
          SCUBA: snap.child('SCUBA').val(),
          vehicleExtrication: snap.child('vehicleExtrication').val(),
          schoolBusExtrication: snap.child('schoolBusExtrication').val(),
          largeTruck: snap.child('largeTruck').val(),
          agriculturalRescue: snap.child('agriculturalRescue').val(),
          machineryRescue: snap.child('machineryRescue').val(),
          USARMedical: snap.child('USARMedical').val(),
          USARHeavyRigging: snap.child('USARHeavyRigging').val(),
          grainBin: snap.child('grainBin').val(),
          misc: snap.child('misc').val(),
        })
      })
  }

  openNotification() {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        Confirm
      </Button>
    );
    notification.open({
      message: "Security Warning",
      description: "For greater security, editing a profile can only be done if the user has recently logged in.  If you haven't logged in in the past few minutes, please log out, then log back in to edit your profile. ",
      type: "warning",
      duration: 0,
      btn,
      key,
    });
  };

  onChangeText(key, e) {
    let member = Object.assign({}, this.state.member);
    member[key] = e.target.value;
    this.setState({ member });
    if (key === 'email') {
      this.setState({ email: e.target.value})
    }
  }

  onChangeSelect(key, e) {
    let member = Object.assign({}, this.state.member);  
    member[key] = e;                        
    this.setState({member});
  }

  save(e) {
    var that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
          
          var user = firebase.auth().currentUser;
          user.updateEmail(that.state.email).then(function () {
            that.props.saved()
            database.ref('users/' + that.state.userId).update(that.state.member)
          }).catch(function (error) {
            alert(error)
          });
        }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { size } = this.props;
    const { TextArea } = Input;

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

    return (
      <div>

      <Form onSubmit={this.save.bind(this)} className="createEventForm">

        <FormItem {...formItemLayout} label='Name'>
          {getFieldDecorator('name', {
            rules: [{ required: false }],
          })(
            <Input
              disabled={true}
              onChange={this.onChangeText.bind(this, 'name')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Email'>
          {getFieldDecorator('email', {
            rules: [{ required: false }, {type: 'email'}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'email')}
            />
            )}
            <Tooltip placement="right" title="This email address will be used for contact AND login">
              <Icon type="question-circle" />
            </Tooltip>
        </FormItem>

        <FormItem {...formItemLayout} label='Phone'>
          {getFieldDecorator('phone', {
            rules: [{ required: false }, {max: 20}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'phone')}
            />
            )}
        </FormItem>

        <hr />

        <FormItem {...formItemLayout} label='Emergency Contact'>
          {getFieldDecorator('emergencyContact', {
            rules: [{ required: false }, {max: 60}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'emergencyContact')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Relationship'>
          {getFieldDecorator('relationship', {
            rules: [{ required: false }, {max: 60}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'relationship')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Emergency Phone'>
          {getFieldDecorator('emergencyPhone', {
            rules: [{ required: false }, {max: 20}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'emergencyPhone')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Emergency Address'>
          {getFieldDecorator('emergencyAddress', {
            rules: [{ required: false }, {max: 200}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'emergencyAddress')}
            />
            )}
        </FormItem>

        <hr />

        <FormItem {...formItemLayout} label='Department'>
          {getFieldDecorator('department', {
            rules: [{ required: false }, {max: 100}],
          })(
            <Input
              onChange={this.onChangeText.bind(this, 'department')}
            />
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Medical License'>
          {getFieldDecorator('medicalLicense', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'medicalLicense')}
              >
                <Select.Option value="EMT">EMT</Select.Option>
                <Select.Option value="Paramedic">Paramedic</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Fire Fighter'>
          {getFieldDecorator('firefighter', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'firefighter')}
              >
                <Select.Option value="FF 1">FF 1</Select.Option>
                <Select.Option value="FF 1 & 2">FF 1 & 2</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Fire Officer'>
          {getFieldDecorator('fireOfficer', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'fireOfficer')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Staff And Command'>
          {getFieldDecorator('staffAndCommand', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'staffAndCommand')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='ICS'>
          {getFieldDecorator('ICS', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'ICS')}
              >
                <Select.Option value="ICS-100">ICS-100</Select.Option>
                <Select.Option value="ICS-200">ICS-200</Select.Option>
                <Select.Option value="ICS-300">ICS-300</Select.Option>
                <Select.Option value="ICS-400">ICS-400</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='UICS'>
          {getFieldDecorator('UICS', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'UICS')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='RIT'>
          {getFieldDecorator('RIT', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'RIT')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Hazardous Materials'>
          {getFieldDecorator('hazardousMaterials', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'hazardousMaterials')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Swift Water'>
          {getFieldDecorator('swiftWater', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'swiftWater')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Rope Rescue'>
          {getFieldDecorator('ropeRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'ropeRescue')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Tower Rescue'>
          {getFieldDecorator('towerRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'towerRescue')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Confined Space'>
          {getFieldDecorator('confinedSpace', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'confinedSpace')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Trench Rescue'>
          {getFieldDecorator('trenchRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'trenchRescue')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Structural Collapse'>
          {getFieldDecorator('structuralCollapse', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'structuralCollapse')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Ice Rescue'>
          {getFieldDecorator('iceRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'iceRescue')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Open Water Rescue'>
          {getFieldDecorator('openWaterRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'openWaterRescue')}
              >
                <Select.Option value="Awareness">Awareness</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Technician">Technician</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='SCUBA'>
          {getFieldDecorator('SCUBA', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'SCUBA')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Vehicle Extrication'>
          {getFieldDecorator('vehicleExtrication', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'vehicleExtrication')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='School Bus Extrication'>
          {getFieldDecorator('schoolBusExtrication', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'schoolBusExtrication')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Large Truck'>
          {getFieldDecorator('largeTruck', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'largeTruck')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='agriculturalRescue'>
          {getFieldDecorator('agriculturalRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'agriculturalRescue')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Machinery Rescue'>
          {getFieldDecorator('machineryRescue', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'machineryRescue')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='USAR Medical'>
          {getFieldDecorator('USARMedical', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'USARMedical')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='USAR Heavy Rigging'>
          {getFieldDecorator('USARHeavyRigging', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'USARHeavyRigging')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Grain Bin'>
          {getFieldDecorator('grainBin', {
            rules: [{ required: false }],
          })(
              <Select
                size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeSelect.bind(this, 'grainBin')}
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Misc'>
          {getFieldDecorator('misc', {
            rules: [{ required: false }, {max: 1000}],
          })(
            <TextArea
              onChange={this.onChangeText.bind(this, 'misc')}
              placeholder='Please list any other relevant skills, licenses, or certifications.'
            />
            )}
        </FormItem>

        <Button htmlType="submit">Save</Button>

      </Form>
      
      </div>    
    )
  }
}

const EditProfile = Form.create()(EditProfileForm);

export default EditProfile;