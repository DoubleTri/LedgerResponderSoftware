import React, { Component } from 'react';
import { Form, Input, Button, TimePicker, Popconfirm } from 'antd';
import moment from 'moment';

import * as firebase from 'firebase';

const FormItem = Form.Item;
var database = firebase.database();

class EditEventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: this.props.ISOString,
            title: this.props.title,
            eventInfo: this.props.eventInfo,
            eventKey: this.props.eventKey,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            addTime: false
        };
    }

    componentDidMount() {

        this.props.form.setFieldsValue({
            title: this.state.title,
            eventInfo: this.state.eventInfo,
            startTime: moment(this.state.startTime, 'HH:mm'),
            endTime: moment(this.state.endTime, 'HH:mm')
        })
    }

    submit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var newData = {
                    title: this.state.title,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    eventInfo: this.state.eventInfo
                }
                this.props.close()
                return database.ref('events/' + this.state.eventKey).update(newData);
            }
        })
    }

    delete() {
        this.props.close()
        return database.ref('events/' + this.state.eventKey).remove();
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
            startTime: time.format('HH:mm')
        })
    }

    onChangeEndTime(time) {
        this.setState({
            endTime: time.format('HH:mm')
        })
    }

    close() {
        this.props.close();
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
                            onChange={this.onChangeTitle.bind(this)}
                        />
                        )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('startTime', {
                        rules: [{ required: false }],
                    })(
                        <TimePicker onChange={this.onChangeStartTime.bind(this)} placeholder='Start Time' format={format} />
                        )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('endTime', {
                        rules: [{ required: false }],
                    })(
                        <TimePicker onChange={this.onChangeEndTime.bind(this)} placeholder='End Time' format={format} />
                        )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('eventInfo', {
                        rules: [{ required: false }],
                    })(
                        <TextArea rows={4}
                            placeholder="Enter Event Info"
                            onChange={this.onChangeEventInfo.bind(this)}
                        />
                        )}
                </FormItem>

                <hr />

                <FormItem>
                    <Button onClick={this.props.close}>Close</Button>
                    <Popconfirm title={"Are you sure you'd like to delete " + this.state.title + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
                        <Button>Delete</Button>
                    </Popconfirm>
                    <Button htmlType="submit">Submit</Button>
                </FormItem>

            </Form>
        )
    }
}

const EditEvent = Form.create()(EditEventForm);

export default EditEvent;