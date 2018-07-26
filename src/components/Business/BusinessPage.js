import React, { Component } from 'react';
import { auth } from '../firebase';
import * as firebase from 'firebase';
import { Form, Icon, Input, Button, Checkbox, Col, Tooltip, message, InputNumber, TextArea, Popconfirm, Modal, notification } from 'antd';
import ChangePassword from '../UserProfile/ChangePassword';
//import ReactAutocomplete from 'react-autocomplete';

//import erg from '../erg'

const FormItem = Form.Item;
var database = firebase.database();

class BusinessPageForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
        businessName: this.props.match.params.businessName,
        value: '',
        open: false,
        openPassword: false,
        user: this.props.user
    }
  }

    componentDidMount() {
        var that = this
        var key = '';
        var materials = []

        database.ref('users/').orderByChild('name').equalTo(this.props.match.params.businessName).once("value", function (snap) {
            snap.forEach(function (data) {
                key = data.key
                that.setState({ key: data.key })
            });
            database.ref('users/' + key).on("value", function (snap) {
                console.log(snap.val())
                that.setState({
                    addItem: snap.child('addItem').val(),
                    businessInfo: snap.val(),
                    newBusinessInfo: snap.val()
                })
                that.props.form.setFieldsValue({
                  name: snap.child('name').val(),
                  address: snap.child('address').val(),
                  businessPhone: snap.child('businessPhone').val(),
                  contact: snap.child('contact').val(),
                  email: snap.child('email').val(),
                  phone: snap.child('phone').val(),
                  phoneSecond: snap.child('phoneSecond').val() ? snap.child('phoneSecond').val() : 'none'
                })
            })
        })

        // erg.map((material) => {
        //   materials.push({label: material.properties["Name of material"], id: material.properties["ID No."] + material.properties["Name of material"]})
        // })
        // that.setState({ materials: materials.sort((a, b) => a.label.localeCompare(b.label)) })
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

    addItem(e) {
        e.preventDefault()

        var that = this;
    
        var item = this.props.form.getFieldValue('item')
        var location = this.props.form.getFieldValue('location')
        var quantity = this.props.form.getFieldValue('quantity')
        var notes = this.props.form.getFieldValue('notes') ? this.props.form.getFieldValue('notes') : null
        var added = Date.now() 
    
        that.setState({ 
          addItem: this.state.addItem ? this.state.addItem.concat([{item, location, quantity, notes, added}]) : [{item, location, quantity, notes, added}],
        })

        setTimeout(function() {
        var itemData = {
            addItem: that.state.addItem,
          }
          database.ref('users/' + that.state.key).update(itemData)
        }, 500)

        // this.updateDb(this.state.addItem)



        this.props.form.resetFields()
      }

      updateDb(addItem) {
          console.log(addItem)
        //database.ref('users/' + this.state.key).update(addItem)
      }

      delete(key) {
        var newState = this.state.addItem.filter(x => x.item !== key);
    
        this.setState({ 
          addItem: newState,  
        })

        database.ref('users/' + this.state.key).update({addItem: newState})
      }

      // onChangeText(key, e) {
      //   this.setState({ [key]: e.target.value })
      // }

      onChangeText(key, e) {
        console.log(e + key)
        const obj = this.state.newBusinessInfo;
        obj[key] = e.target.value;
    
        // update state
        this.setState({
            newBusinessInfo: obj
        });
      }

      edit() {
        this.setState({ open: true })
        this.openNotification()
      }

      close() {
        this.setState({ open: false })
      }

      handleSubmit(e) {
        e.preventDefault()
        database.ref('users/' + this.state.key).update(this.state.newBusinessInfo);
        var user = firebase.auth().currentUser;
        user.updateEmail(this.state.newBusinessInfo.email)
      }

      changePassword() {
        this.setState({ openPassword: true, open: false })
      }

      closePassword() {
        this.setState({ openPassword: false })
      }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;

    var items = this.state.addItem && this.state.addItem.length > 0 ? 
    this.state.addItem.map((item, i) => {
      return <li key={item.item + i}><b>{item.item}</b> {item.quantity}, {item.location} 
      {item.notes ? 
        <span style={{ marginLeft: '20px' }}><Tooltip placement="right" title={item.notes}>
        <Icon type="message" />
      </Tooltip></span>
        :
        null
      }
        <Popconfirm title={"Are you sure you'd like to delete " + item.item + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
          <Icon style={{ marginLeft: '20px', color: '#C84747' }} type="close-circle-o" />
        </Popconfirm>
      </li>
    })
    :
    'No items added'

    return (
      <div>
        <Col xs={{ span: 18, offset: 4 }} md={{ span: 14, offset: 6 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <h2>{this.state.businessName}</h2>
        <div>{this.state.businessInfo?
          <div>{this.state.businessInfo.address} 
          <br />  
          {this.state.businessInfo.businessPhone}
          <br /> 
          Contact Person: {this.state.businessInfo.contact}
          <br />
          <p style={{ fontSize: '12px', margin: '8px' }} onClick={this.edit.bind(this)}>Edit Business Info</p> 
          
          </div>
          : 'loading...'}</div>
          <hr />
        <div style={{ marginLeft: '3em', marginTop: '2em', marginBottom: '2em' }}>
        
          <ul>
            {items}
          </ul>
        </div>
        <hr />
        <h4>Add Material</h4>
        <Form onSubmit={this.addItem.bind(this)} className="business-form" layout="inline">

            {/* {this.state.materials ?
              <ReactAutocomplete
                style={{ margin: '15px' }}
                items={this.state.materials}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={item => item.label}
                renderItem={(item, highlighted) =>
                  <div
                    key={item.id}
                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
                  >
                    {item.label}
                  </div>
                }
                value={this.state.value}
                onChange={e => this.setState({ value: e.target.value })}
                onSelect={value => this.setState({ value })}
              />
              : 'loading...'}         */}

        <FormItem>
            {getFieldDecorator('item', {
              rules: [{ required: true }, {max: 100}],
            })(
              <Input placeholder="Material" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('quantity', {
               rules: [{ required: true }, {max: 100}],
              })(
                <Input placeholder="Quantity" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('location', {
               rules: [{ required: true }, {max: 100}],
              })(
                <Input placeholder="Location" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('notes', {
               rules: [{ required: false }, {max: 500}],
              })(
                <TextArea rowes={4} placeholder="Additional Notes" />
              )}
          </FormItem>

          <Button htmlType="submit">Submit Item</Button>

        </Form>
        </Col>

{/* Business Edit Modal */}
        <Modal
          title={this.state.businessInfo ? this.state.businessInfo.name : null}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          footer={null}
        >

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
             <div style={{ fontSize: '12px', marginLeft: '8px' }}>This willl be the login email for {this.state.businessName}'s account</div>
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
                <a onClick={this.changePassword.bind(this)}>Change Password</a>
    <hr />
                 <Button htmlType="submit">Submit Changes</Button>

        </Form>

        </Modal>

{/* Change Password Modal */}
        <Modal
          title="Password Change"
          visible={this.state.openPassword}
          onCancel={this.closePassword.bind(this)}
          footer={null}
        >
          <ChangePassword close={this.closePassword.bind(this)} user={this.state.user} />

        </Modal>

      </div>
    );
  }
}

const BusinessPage = Form.create()(BusinessPageForm);

export default BusinessPage;