import React, { Component } from 'react';
//import { auth } from '../firebase';
import * as firebase from 'firebase';
import { Form, Icon, Input, Button, Checkbox, Col, Tooltip, message } from 'antd';

const FormItem = Form.Item;
var database = firebase.database();

class CreateUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: Date.now(),
      trt: false,
      h2o: false,
      chief: false,
      admin: false
    }
  }

  componentDidMount() {

  }

  onChangeText(key, e) {
    this.setState({ [key]: e.target.value })
  }

  onChangeCheck(key, e) {
    this.setState({ [key]: !this.state[key] })
  }
  
  onChangeChief(key, e) {
    this.setState({ 
      chief: !this.state.chief, 
      trt: false,
      h2o: false,
      admin: false
     })
  }

  handleSubmit(e) {
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {

        var config = {
          apiKey: "AIzaSyDw3oQ-XTr9Wb2-bZSITrE8cedTlr9CrnI",
          authDomain: "learned-be3e3.firebaseapp.com",
          databaseURL: "https://learned-be3e3.firebaseio.com/"
        };
        var secondaryApp = firebase.initializeApp(config, Date.now().toString());

        const promise = secondaryApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
          secondaryApp.auth().signOut();
            var db = database.ref('users');
            var userData = {
              email: this.state.email,
              name: this.state.firstName + ' ' + this.state.lastName,
              lastName: this.state.lastName,
              admin: this.state.admin ? true : false,
              trt: this.state.trt ? 'Yes' : 'No',
              water: this.state.h2o ? 'Yes' : 'No',
              visable: this.state.chief ? 'No' : 'Yes'
            }
            db.push(userData)
            message.success(this.state.firstName + " " + this.state.lastName + "'s account has been created.")
            that.props.form.resetFields()
        })
        promise.catch(function(e){
          if(e){
            message.error(e.message)
            secondaryApp.auth().signOut();
          }
        });
      }
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Col xs={{ span: 18, offset: 4 }} md={{ span: 14, offset: 6 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <h2>Create New User</h2>
        <br />
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <FormItem>
            {getFieldDecorator('firstName', {
              rules: [{ required: true, message: "Please enter new user's first name." }, {max: 30}],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'firstName')} placeholder="First Name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('lastName', {
              rules: [{ required: true, message: "Please enter new user's last name." }, {max: 30}],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'lastName')} placeholder="Last Name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: "Please enter user's email." }, {type: 'email'}],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'email')} placeholder="Email" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: "Create user's password" }, {max: 30}],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'password')} placeholder="Password" />
            )}
          </FormItem>

            <FormItem>
              {getFieldDecorator('chief', {
                valuePropName: 'checked',
              })(
                <Checkbox onChange={this.onChangeChief.bind(this, 'chief')}>
                  Chief <Tooltip placement="right" title='if checked the user will be given access to the site, but will not be added to any team rosters'>
                    <Icon type="question-circle" />
                  </Tooltip>
                </Checkbox>
              )}
            </FormItem>

{!this.state.chief ? <div>
            <FormItem>
              {getFieldDecorator('admin', {
                valuePropName: 'checked',
              })(
                <Checkbox onChange={this.onChangeCheck.bind(this, 'admin')}>Admin </Checkbox>
              )}
            </FormItem>

          <FormItem>
            {getFieldDecorator('trt', {
              valuePropName: 'checked',
            })(
              <Checkbox onChange={this.onChangeCheck.bind(this, 'trt')}>TRT Member </Checkbox>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('h2o', {
              valuePropName: 'checked',
            })(
              <Checkbox onChange={this.onChangeCheck.bind(this, 'h2o')}>H2O Member </Checkbox>
            )}
          </FormItem>
          </div>: null }

            <Button htmlType="submit">Create User</Button>

        </Form>
        </Col>
      </div>
    );
  }
}

const CreateUser = Form.create()(CreateUserForm);

export default CreateUser;