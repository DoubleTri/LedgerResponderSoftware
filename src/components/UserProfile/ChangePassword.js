import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

const FormItem = Form.Item;

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log(this.props.user)
  }

  submit(e) {
    e.preventDefault();
    let user = this.props.user
    this.props.form.validateFields((err, values) => {
      if (!err) {
        user.updatePassword(this.props.form.getFieldValue('password')).then(function () {
          message.success('Password successfully changed.');
        }).catch(function (error) {
          message.warning(error.message)
        });
        this.props.close();
      }
    });
  }

  compareToFirstPassword(rule, value, callback) {
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback('Two passwords inconsistent!');
    } else {
      callback();
    }
  }

  close() {
    this.props.close()
  }

  render() {
    
    const { getFieldDecorator } = this.props.form;

    return (
      <div>

        <Form onSubmit={this.submit.bind(this)}>

          <FormItem>
            <h3>Please enter your new password twice</h3>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please enter new password.' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('confirmPassword', {
              rules: [{
                required: true, message: 'Please confirm new password',
              }, {
                validator: this.compareToFirstPassword.bind(this),
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
          </FormItem>
      
            <Button htmlType="submit">Submit</Button>
            <Button onClick={this.close.bind(this)}>Close</Button>
   
        </Form>

      </div>
    )
  }
}

const ChangePassword = Form.create()(ChangePasswordForm);

export default ChangePassword;