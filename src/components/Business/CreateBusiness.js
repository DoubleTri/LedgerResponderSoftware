import React, { Component } from 'react';
//import { auth } from '../firebase';
import * as firebase from 'firebase';
import { Form, Icon, Input, Button, Checkbox, Col, Tooltip, message } from 'antd';

const FormItem = Form.Item;
var database = firebase.database();

class CreateBusinessForm extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  onChangeText(key, e) {
    this.setState({ [key]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {

        var config = {
          apiKey: "AIzaSyC65lhWKb56zt-kHcJGowfR5NuRtrMLiQM",
          authDomain: "ledger-master.firebaseapp.com",
          databaseURL: "https://learned-master.firebaseio.com/"
        };
        var secondaryApp = firebase.initializeApp(config, Date.now().toString());

        const promise = secondaryApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
          secondaryApp.auth().signOut();
            var db = database.ref('users');
            var businessData = {
              name: this.state.name,
              address: this.state.address,
              businessPhone: this.state.businessPhone,
              contact: this.state.contact,
              email: this.state.email,
              phone: this.state.phone,
              phoneSecond: this.state.phoneSecond ? this.state.phoneSecond : null, 
              business: true
            }
            db.push(businessData)
            message.success(this.state.name + "'s account has been created.")
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
            {getFieldDecorator('name', {
              rules: [{ required: true, message: "Please enter new business name." }, {max: 30}],
            })(
              <Input prefix={<Icon type="shop" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'name')} placeholder="Business Name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: "Please enter address." }, {max: 30}],
            })(
              <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'address')} placeholder="Business Address" />
            )}
          </FormItem>

            <FormItem>
              {getFieldDecorator('businessPhone', {
                rules: [{ required: true, message: "Please enter business phone number." }, { max: 30 }],
              })(
                <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'businessPhone')} placeholder="Business Phone Number" />
              )}
            </FormItem>

    <hr />

          <FormItem>
            {getFieldDecorator('contact', {
              rules: [{ required: true, message: "Please enter contact person's name." }, {max: 30}],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'contact')} placeholder="Contact Name" />
            )}
          </FormItem>

            <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: "Please enter user's email." }, {type: 'email'}],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'email')} placeholder="Contact Email (used for login)" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: "Please enter user's phone number." }],
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'phone')} placeholder="Contact Phone" />
            )}
          </FormItem>

                    <FormItem>
            {getFieldDecorator('phoneSecond', {
              rules: [{ required: false, message: "Please enter user's secondary phone number." }],
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'phoneSecond')} placeholder="Contact's Secondary Phone" />
            )}
          </FormItem>

    <hr />

          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: "Create user's password" }, {max: 30}],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onChangeText.bind(this, 'password')} placeholder="Password" />
            )}
          </FormItem>

            <Button htmlType="submit">Create User</Button>

        </Form>
        </Col>
      </div>
    );
  }
}

const CreateBusiness = Form.create()(CreateBusinessForm);

export default CreateBusiness;