import React, { Component } from 'react';
import { Form, Input, Button, TimePicker } from 'antd';

import * as firebase from 'firebase';


const FormItem = Form.Item;
var database = firebase.database();

class CreateEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: props.ISOString,
      title: '',
      startTime: null,
      endTime: null,
      eventInfo: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      start: nextProps.ISOString,
    });
}

  submit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        
        var db = database.ref('events');
        var data = {
          start: this.state.start,
          title: this.state.title,
          startTime: this.state.startTime !== null? this.state.startTime.format('HH:mm') : '',
          endTime: this.state.endTime !== null? this.state.endTime.format('HH:mm') : '',
          eventInfo: this.state.eventInfo
        }
        db.push(data)
        this.props.form.resetFields()
        this.props.close()
      } 
    });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    })
  }

  onChangeEventInfo(e) {
    this.setState({
      eventInfo: e.target.value
    })
  }

  onChangeStartTime(time) {
    this.setState({
      startTime: time
    })
  }

  onChangeEndTime(time) {
    this.setState({
      endTime: time
    })
  }

  close() {
    this.props.form.resetFields()
    this.props.close()
  }
  
  render() {

    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const format = 'HH:mm';

    return (
      <Form onSubmit={this.submit.bind(this)} className="createEventForm">

        <FormItem>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input event title.' }],
          })(
            <Input
            placeholder="Enter Event Title"
            setfieldsvalue={this.state.title}
            onChange={this.onChangeTitle.bind(this)}
          />
            )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('startTime', {
            rules: [{ required: false }],
          })(
          <TimePicker onChange={this.onChangeStartTime.bind(this)} placeholder='Start Time' format={format}/>
            )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('endTime', {
            rules: [{ required: false }],
          })(
          <TimePicker onChange={this.onChangeEndTime.bind(this)} placeholder='End Time' format={format}/>
            )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('eventInfo', {
            rules: [{ required: false }],
          })(
            <TextArea rows={4}
            placeholder="Enter Event Info"
            setfieldsvalue={this.state.eventInfo}
            onChange={this.onChangeEventInfo.bind(this)}
          /> 
            )}
        </FormItem>

        <hr />

        <FormItem>
          <Button onClick={this.close.bind(this)}>Close</Button>
          <Button htmlType="submit">Submit</Button>
        </FormItem>

      </Form>
    )
  }
}

const CreateEvent = Form.create()(CreateEventForm);

export default CreateEvent;

