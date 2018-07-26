import React, { Component } from 'react';
import { Form, Button, Input, Select, DatePicker, message } from 'antd';
import * as firebase from 'firebase';

var database = firebase.database();
const FormItem = Form.Item;

class EquipmentOutFormForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.name,
      startDate: '',
      equipment: '',
      takenOffOf: '',
      reason: ''
    };
  }

  componentDidMount() {
    console.log(this.props.name)
    this.props.form.setFieldsValue({
      signedOutBy: this.props.name 
    })
  }

  submit(e) {
    var that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
          var data = {
            name: this.state.userName,
            equipment: this.state.equipment,
            takenOffOf: this.state.takenOffOf,
            reason: this.state.reason,
            from: this.state.startDate.format('MMMM D, YYYY HH:mm')
          }
          database.ref('equipment').push(data).then(function(){
            message.success(that.state.equipment + ' successfully checked out')
            that.props.form.resetFields()
          })
        }
    })
}

onChangeEquipment(e) {
  this.setState({ equipment: e.target.value })
}

onChangeTakenOffOf(e) {
  this.setState({takenOffOf: e})
}

onChangeReason(e) {
  this.setState({ reason: e.target.value})
}

onChangeDate(e, date){
  this.setState({startDate: e})
}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { size } = this.props
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
        <Form onSubmit={this.submit.bind(this)} className="EquipmentOutFormForm">

          <FormItem {...formItemLayout} label='Equipment'>
            {getFieldDecorator('equipment', {
              rules: [{ required: true, message: 'Please input type of equipment being signed out.' }, {max: 100}],
            })(
              <Input
                onChange={this.onChangeEquipment.bind(this)}
              />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Signed Out by'>
            {getFieldDecorator('signedOutBy', {
              rules: [{ required: true, message: 'Please input personnel signing equipment out' }],
            })(
              <Input
                disabled={true}
              />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Taken Off Of'>
            {getFieldDecorator('takenOffOf', {
              rules: [{ required: true, message: 'Please select what truck the equipment was taken off of' }],
            })(
              <Select
                size={size}
                style={{ width: '50%' }}
                onChange={this.onChangeTakenOffOf.bind(this)}
              >
                <Select.Option value="17-1">17-1</Select.Option>
                <Select.Option value="17-2">17-2</Select.Option>
                <Select.Option value="17-3">17-3</Select.Option>
                <Select.Option value="17-4">17-4</Select.Option>
                <Select.Option value="17-5">17-5</Select.Option>
                <Select.Option value="17-6">17-6</Select.Option>
                <Select.Option value="Trailer 1 (PTFD)">Trailer 1 (PTFD)</Select.Option>
                <Select.Option value="Trailer 2 (AAFD)">Trailer 2 (AAFD)</Select.Option>
                <Select.Option value="Boat">Boat</Select.Option>
              </Select>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label='Reason'>
            {getFieldDecorator('reason', {
              rules: [{ required: true, message: 'Please give your reason for signing equipment out' }, {max: 300}],
            })(
              <TextArea rows={4}
                placeholder="Please give reason for signing equipment out"
                onChange={this.onChangeReason.bind(this)}
              />
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="Date and Time" >
          {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please input date and time you checked equipment out' }],
            })(
            <DatePicker size={size} style={{ width: '50%' }} onChange={this.onChangeDate.bind(this)} showTime format="MMMM D, YYYY HH:mm" />
          )}
        </FormItem>

          <Button htmlType="submit">Submit</Button>
        </Form>

      </div>
    )
  }
}

const EquipmentOutForm = Form.create()(EquipmentOutFormForm);

export default EquipmentOutForm;