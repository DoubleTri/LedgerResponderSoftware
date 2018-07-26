import React, { Component } from 'react';
import { storage } from '../firebase';
import * as firebase from 'firebase';
import { Form, Button, Input, Select, message, Col, Tooltip, Icon } from 'antd';
import ReactQuill from 'react-quill';
import Files from 'react-files'

var database = firebase.database();
var storageRef = storage.ref();
const FormItem = Form.Item;

class GroupEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      users: null
    };
  }

  componentDidMount() {

    var that = this;

    var team = []
    var wholeTeam = [];
    var trt = [];
    var waterTeam = [];
    var admin = [];
    var annArbor = [];
    database.ref('users').on('value', function (snap) {
      team = []
      snap.forEach(function (item) {
        if (item.child('visable').val() !== "No") {
          team.push(item.val())
        }
      })
      var alpha = team.sort((a, b) => a.lastName.localeCompare(b.lastName))
      alpha.map((objects) => {
        wholeTeam.push(objects.email)
        if (objects.water === 'Yes') {waterTeam.push(objects.email)}
        if (objects.admin === 'Yes') {admin.push(objects.email)}
        if (objects.trt === 'Yes') {trt.push(objects.email)}
        if (objects.department === 'City of Ann Arbor') {annArbor.push(objects.email)}
        return true
      })
    this.setState({ wholeTeam, trt, waterTeam, admin, annArbor })
    }.bind(this));
    this.props.form.setFieldsValue({
      name: this.props.name
    })

    database.ref('users').orderByChild('name').equalTo(this.props.name).once("value", function (snap) {
        snap.forEach(function (data) {
            that.setState({ sender: data.child('email').val() })
        });
    });

  }

  onSubjectChange(e) {
    this.setState({ subject: e.target.value })
  }
  
  onChangeGroup(e) {

    var group;

    if (e === 'Whole Team') {
        group = this.state.wholeTeam
    } else if (e === 'Water Team') {
        group = this.state.waterTeam
    } else if (e === 'TRT') {
        group = this.state.trt
    } else if (e === 'admin') {
        group = this.state.admin
    }else if (e === 'Ann Arbor') {
        group = this.state.annArbor
    }else if (e === 'test') {
      group = 'ryanr1423@gmail.com'
  }
    this.setState({ group: group, recipients: e })
  }

  onChangeMessage(e) {
    this.setState({ message: e })
  }

  submit(e) {
    e.preventDefault()

    var that = this;
    var helloworld = firebase.functions().httpsCallable('helloworld');

    this.props.form.validateFields((err, values) => {
      if (!err) {

        if(this.state.loadedFile){ 

        var fileUpload = this.state.loadedFile;
        var name = this.state.name;
        var fileSend = storage.ref('attachments/' + fileUpload.name);
        var task = fileSend.put(fileUpload);

          task.on("state_changed", function (snap) {
            var percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            if (percentage === 100) {
              storageRef.child('attachments/' + fileUpload.name).getDownloadURL().then(function (url) {
                helloworld({
                  name: that.state.name,
                  recipients: that.state.recipients,
                  group: that.state.group,
                  subject: that.state.subject,
                  sender: that.state.sender,
                  attachment: { fileName: fileUpload.name, path: url },
                  message: that.state.message
                })
                  .then(function (result) {
                    message.success('Email Sent Successfully');
                    that.props.form.resetFields()
                  }).catch(function (error) {
                    console.log(error)
                  });
              });
            }
          })
        }else{
          helloworld({
            name: this.state.name,
            recipients: this.state.recipients,
            group: this.state.group,
            subject: this.state.subject,
            sender: that.state.sender,
            message: this.state.message
          })
            .then(function (result) {
              message.success('Email Sent Successfully');
              that.props.form.resetFields()
            }).catch(function (error) {
              console.log(error)
            });
          }
      }
    })
  }

  store(e) {
    this.setState({ loadedFile: e.target.files[0] })
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    var modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link']
      ]
    }
  
  var formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 
    ]

    return (
      <div >
        <Col xs={{span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} > 
          <h2>Group Email</h2>
          <Tooltip placement="right" title="Replies to a group email will be sent to the sender's email address.">
            <Icon type="question-circle" />
          </Tooltip>
        <Form onSubmit={this.submit.bind(this)} className="addBlogPostForm">

          <FormItem label='From'>
            {getFieldDecorator('name')(
              <Input
                disabled={true}
              />
            )}
          </FormItem>

          <FormItem label='Recipient Group'>
          {getFieldDecorator('group', {
            rules: [{ required: true, message: 'Must include a recipient group' }],
          })(
              <Select
                //size={size}
                style={{ width: '32%' }}
                onChange={this.onChangeGroup.bind(this)}
              >
                <Select.Option value="Whole Team">Whole Team</Select.Option>
                <Select.Option value="TRT">TRT</Select.Option>
                <Select.Option value="Water Team">Water Team</Select.Option>
                <Select.Option value="admin">Team Leaders</Select.Option>
                <Select.Option value="Ann Arbor">Ann Arbor Members</Select.Option>
                {/* <Select.Option value="test">test</Select.Option> */}
              </Select>
            )}
        </FormItem>

          <FormItem label='Subject'>
            {getFieldDecorator('subject', {
              rules: [{ required: true, message: 'Must include a subject' }],
            })(
              <Input
                onChange={this.onSubjectChange.bind(this)}
              />
              )}
          </FormItem>

            <div className="image-upload" style={{ marginBottom: '15px'}}>
              <label htmlFor="file-input">
                Attach a file:
              </label>
              <input id="file-input" type="file" onChange={this.store.bind(this)} />
            </div> 
            

          <FormItem>
            <ReactQuill
              //defaultValue={this.state.message}
              onChange={this.onChangeMessage.bind(this)}
              modules={modules}
              formats={formats}
              style={{ height: "500px", marginBottom: "50px" }}
            />
          </FormItem>

          <br />

              <Button htmlType="submit">Send</Button>
          

        </Form>
</Col>
      </div>
    )
  }
}

const GroupEmail = Form.create()(GroupEmailForm);

export default GroupEmail;