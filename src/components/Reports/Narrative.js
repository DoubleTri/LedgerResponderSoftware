import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
var database = firebase.database();

class NarrativeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runNumber: this.props.getStore().runNumber,
      reportKey: this.props.getStore().reportKey,
      initialActions: null,
      sustainedActions: null, 
      termination: null,
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      initialActions: this.props.getStore().initialActions ? this.props.getStore().initialActions : null,
      sustainedActions: this.props.getStore().sustainedActions ? this.props.getStore().sustainedActions : null,
      termination: this.props.getStore().termination ? this.props.getStore().termination : null,
  })
  }

  onChangeText(key, e) {
    this.setState({ [key]: e.target.value })
    this.props.updateStore({
      [key]: e.target.value
    });
  }

  previous() {
    return this.props.jumpToStep(0)
  }

  submit(e) {
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // Report Data to DB
          var reportData = {
            initialActions: this.props.getStore().initialActions,
            sustainedActions: this.props.getStore().sustainedActions,
            termination: this.props.getStore().termination,
          }
          database.ref('reports/' + this.state.reportKey).update(reportData)
          return that.props.jumpToStep(2)
        }
        })
  }


  render() {

    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;

    return (
      <div>
        <h3>Report Narrative</h3>
        <Form onSubmit={this.submit.bind(this)} className="createReportForm">

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

          <Button onClick={this.previous.bind(this)}>Previous</Button> <Button htmlType="submit">Next</Button>

        </Form>

      </div>
    )
  }
}

const Narrative = Form.create()(NarrativeForm);

export default Narrative;