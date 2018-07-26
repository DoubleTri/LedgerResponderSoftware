import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Input, Button, Select, DatePicker, TimePicker, Checkbox, Tooltip, Icon } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
var database = firebase.database();

class NumbersFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            multiDay: false,
            reportKey: this.props.reportKey,
            name: this.props.name,
            runNumber: this.props.runNumber,
            pastRunNumbers: null,
            incidentLocation: null,
            activationTime: null,
            arrivalTime: null,
            serviceTime: null,
            requesting: null,
            incidentType: null,
        };
    }

    componentDidMount() {

        //console.log(this.props)
  
        console.log(this.props.getStore())

        var that = this;
        database.ref('reports').orderByChild('runNumber').equalTo(this.props.runNumber).once("value", function (snap) {
            snap.forEach(function (data) {
                //console.log(data.key)
                that.setState({ reportKey: data.key })
                that.props.updateStore({
                    reportKey: data.key
                });
            });
        });

        if (!this.props.getStore().multiDay) {
            this.props.form.setFieldsValue({
                arrivalTime: this.props.getStore().arrivalTime ? moment(this.props.getStore().arrivalTime, 'HH:mm:ss') : null,
                serviceTime: this.props.getStore().serviceTime ? moment(this.props.getStore().serviceTime, 'HH:mm:ss') : null,
            })
        } else {
            this.props.form.setFieldsValue({
                arrivalTime: this.props.getStore().arrivalTime ? moment(this.props.getStore().arrivalTime, 'MMMM D, YYYY HH:mm:ss') : null,
                serviceTime: this.props.getStore().serviceTime ? moment(this.props.getStore().serviceTime, 'MMMM D, YYYY HH:mm:ss') : null,
            })
            this.multiDay()
        }

        this.props.form.setFieldsValue({
            date: this.props.getStore().date ? moment(this.props.getStore().date, 'MMMM D, YYYY') : null,
            name: this.props.getStore().name,
            runNumber: this.props.getStore().runNumber,
            incidentLocation: this.props.getStore().incidentLocation ? this.props.getStore().incidentLocation : null,
            activationTime: this.props.getStore().activationTime ? moment(this.props.getStore().activationTime, 'HH:mm:ss') : null,
            requesting: this.props.getStore().requesting ? this.props.getStore().requesting : null,
            incidentType: this.props.getStore().incidentType ? this.props.getStore().incidentType : null
        })
    }

    onChangeDate(key, dateObj, dateString) {
        this.setState({ [key]: dateString })
        this.props.updateStore({
            [key]: dateString
          });  
    }

    onChangeText(key, e) {
        this.setState({ [key]: e.target.value })
        this.props.updateStore({
            [key]: e.target.value
          });
    }

    onChangeSelect(key, e) {
        this.setState({ [key]: e })
        this.props.updateStore({
            [key]: e 
          });
    }

    multiDay() {
        this.setState({ multiDay: !this.state.multiDay })

    this.state.multiDay ?
        this.props.updateStore({ 
        arrivalTime: moment(this.props.getStore().arrivalTime).format('HH:mm:ss'), 
        serviceTime: moment(this.props.getStore().serviceTime).format('HH:mm:ss') 
      })
      :
      this.props.updateStore({ 
        arrivalTime: moment(this.props.form.getFieldValue('arrivalTime')).format('MMMM D, YYYY HH:mm:ss'), 
        serviceTime: moment(this.props.form.getFieldValue('serviceTime')).format('MMMM D, YYYY HH:mm:ss') 
      })

        this.props.updateStore({
            multiDay: !this.state.multiDay
          });
    }

    submit(e) {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {

                var db = database.ref('reports/' + this.state.reportKey);
                var reportData = {
                    date: this.props.getStore().date,
                    multiDay: this.props.getStore().multiDay,
                    name: this.props.getStore().name,
                    incidentLocation: this.props.getStore().incidentLocation,
                    activationTime: this.props.getStore().activationTime,
                    arrivalTime: this.props.getStore().arrivalTime,
                    serviceTime: this.props.getStore().serviceTime,
                    requesting: this.props.getStore().requesting,
                    incidentType: this.props.getStore().incidentType,
                }
                db.update(reportData).then(() => {
                    return this.props.jumpToStep(1)
                })
            }

        })
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { size } = this.props;

        return (
            <div>
                <h3>Report Times and Numbers</h3>
                <Form onSubmit={this.submit.bind(this)} className="createReportForm">
                    <FormItem label='Date'>
                        {getFieldDecorator('date', {
                            rules: [{ required: true }],
                        })(
                            <DatePicker format="MMMM D, YYYY" onChange={this.onChangeDate.bind(this, 'date')} />
                            )}
                    </FormItem>

                    <FormItem label='Report Completed By'>
                        {getFieldDecorator('name', {
                            rules: [{ required: true }],
                        })(
                            <Input
                                onChange={this.onChangeText.bind(this, 'name')}
                            />
                            )}
                    </FormItem>

                    <FormItem label='Incident Location'>
                        {getFieldDecorator('incidentLocation', {
                            rules: [{ required: true }, {max: 150}],
                        })(
                            <Input
                                onChange={this.onChangeText.bind(this, 'incidentLocation')}
                            />
                            )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('multiDay', {
                            valuePropName: 'checked',
                            initialValue: this.props.getStore().multiDay,
                        })(
                            <Checkbox onChange={this.multiDay.bind(this)}>Multi-Day Incidnet?</Checkbox>
                            )}
                    </FormItem>

                    <FormItem label='Activation Time'>
                        {getFieldDecorator('activationTime', {
                            rules: [{ required: true }],
                        })(
                            <TimePicker
                                onChange={this.onChangeDate.bind(this, 'activationTime')}
                            />
                            )}
                    </FormItem>

                    {this.state.multiDay ? <div>

                        <FormItem label='Arrival Date and Time'>
                            {getFieldDecorator('arrivalTime', {
                                rules: [{ required: true }],
                            })(
                                <DatePicker showTime={true} format="MMMM D, YYYY HH:mm:ss" style={{ width: '35%'}} onChange={this.onChangeDate.bind(this, 'arrivalTime')} />
                                )}
                            <Tooltip placement="right" title="If cancelled en route, mark cancellation time here">
                                <Icon style={{ fontSize: '12px', marginLeft: '10px' }} type="question-circle" />
                            </Tooltip>
                        </FormItem>

                        <FormItem label='In Service Date and Time'>
                            {getFieldDecorator('serviceTime', {
                                rules: [{ required: true }],
                            })(
                                <DatePicker showTime={true} format="MMMM D, YYYY HH:mm:ss" style={{ width: '35%'}} onChange={this.onChangeDate.bind(this, 'serviceTime')} />
                                )}
                        </FormItem>

                    </div>
                        :

                        <div>
                            <FormItem label='Arrival Time'>

                                {getFieldDecorator('arrivalTime', {
                                    rules: [{ required: true }],
                                })(
                                    <TimePicker
                                        onChange={this.onChangeDate.bind(this, 'arrivalTime')}
                                    />
                                    )}
                                <Tooltip placement="right" title="If cancelled en route, mark cancellation time here">
                                    <Icon style={{ fontSize: '12px', marginLeft: '10px' }} type="question-circle" />
                                </Tooltip>
                            </FormItem>

                            <FormItem label='In Service Time'>
                                {getFieldDecorator('serviceTime', {
                                    rules: [{ required: true }],
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
                            rules: [{ required: true }, {max: 100}],
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
                                disabled={true}
                            />
                        )}
                    </FormItem>

                    <FormItem label='Incident Type'>
                        {getFieldDecorator('incidentType', {
                            initialValue: this.props.getStore().incidentType,
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

                    <Button htmlType="submit">Next</Button>

                </Form>
            </div>
        )
    }
}

const Numbers = Form.create()(NumbersFrom);

export default Numbers;