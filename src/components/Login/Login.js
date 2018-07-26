import React, { Component } from 'react';
import { auth } from '../firebase';
import { Modal, Form, Icon, Input, Button, Col } from 'antd';

const FormItem = Form.Item;

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      admin: this.props.admin,
      members: this.props.members,
      pastReports: this.props.pastReports,
      userId: this.props.userId,

      show: false,
      email: '',
      password: '',
      passwordChange: ''
    }
  }

  componentDidMount() {
    if (this.state.userId) {
      if (this.props.location.state) {
        this.props.history.push(this.props.location.state.from)
      } else { this.props.history.push('/') }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const email = this.state.email
        const pass = this.state.password
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => alert(e.message));
        this.props.form.resetFields()
      }
    });
  }

  close() {
    this.setState({ show: false });
  }

  show() {
    this.setState({ show: true });
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value })
  }

  onChangePasswordChange(e) {
    this.setState({ passwordChange: e.target.value })
  }

  forgotPassword() {
    var emailAddress = this.state.passwordChange
    console.log(emailAddress)
    auth.sendPasswordResetEmail(emailAddress).then(function () {
      this.close();
      alert('Please check your email for password reset instructions')
    }).catch(function (error) {
      if (error.code === 'auth/user-not-found') {
        alert(emailAddress + ' is not on file')
      } else {
        alert(error.message)
      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
        <Col xs={{ span: 20, offset: 2 }} sm={{ span: 12, offset: 6 }} style={{ marginTop: '5em' }} >
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please enter your email.' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeEmail.bind(this)} placeholder="Email" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please enter your password.' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangePassword.bind(this)} type="password" placeholder="Password" />
              )}
          </FormItem>
          <FormItem>
            <Button htmlType="submit">Log in</Button>
            <br />
            <a onClick={this.show.bind(this)}>Forgot password</a>
          </FormItem>
          </Col>
        </Form>

        <Modal
          title="Password Recovery"
          visible={this.state.show}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          <p>Please enter the email address associated with this account</p>
          <Input
            placeholder="Enter Your Email"
            type="email"
            onChange={this.onChangePasswordChange.bind(this)}
            value={this.state.passwordChange}
          />
          <br />
          <hr />
          <br />
            <Button onClick={this.forgotPassword.bind(this)}>Submit</Button>
            <Button onClick={this.close.bind(this)}>Close</Button>
        </Modal>

      </div>
    );
  }
}

const Login = Form.create()(LoginForm);

export default Login;