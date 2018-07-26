import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Button, Input, message } from 'antd';
import ReactQuill from 'react-quill';

const FormItem = Form.Item;
var database = firebase.database();

class AddPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: this.props.author,
      text: this.props.text,
      title: this.props.title,
      newPost: this.props.new
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      author: this.state.author,
      title: this.state.title
    })
  }

  handleChange(e) {
    this.setState({ text: e })
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value })
  }

  submit(e) {
    var that = this;
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {

        var firebaseRef = database.ref('blog')
        var data = {
          author: this.state.author,
          title: this.state.title,
          text: this.state.text,
          uid: Date.now().toString()
        }
        firebaseRef.push(data).then(function () {
          message.success('Posted successfully');
          that.props.form.resetFields()
        })
        that.props.close()
      }
    })
  }

  close() {
    this.props.close()
  }

  submitEdit(e) {
    var that = this;
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {

        var key;

        database.ref('blog/').orderByChild('title').equalTo(this.props.title).once("value", function (snap) {
          snap.forEach(function (data) {
            key = data.key
          })
        })

        var data = {
          //author: this.state.author,
          title: this.state.title,
          text: this.state.text
        }

        //console.log(key + ' ' + data)
        database.ref('blog/' + key).update(data).then(function () {
          message.success('Posted Updated successfully');
          that.props.form.resetFields()
        })
        this.props.closeEdit()
      }
    })
  }



  closeEdit() {
    this.props.closeEdit()
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    var modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ]
    }

    var formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]

    return (
      <div>
        
        <Form onSubmit={this.submit.bind(this)} className="addBlogPostForm">

          <FormItem label='Author'>
            {getFieldDecorator('author')(
              <Input
                disabled={true}
              />
            )}
          </FormItem>

          <FormItem label='Title'>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Blog posts must have a title' }],
            })(
              <Input
                onChange={this.onTitleChange.bind(this)}
              />
              )}
          </FormItem>

          <FormItem>
            <ReactQuill
              defaultValue={this.state.text}
              onChange={this.handleChange.bind(this)}
              modules={modules}
              formats={formats}
              style={{ height: "500px", marginBottom: "50px" }}
            />
          </FormItem>

          <br />

          {this.state.newPost ?
            <div>
              <Button htmlType="submit">Submit</Button>
              <Button onClick={this.close.bind(this)}>Close</Button>
            </div>
            :
            <div>
              <Button onClick={this.submitEdit.bind(this)}>Submit Edit</Button>
              <Button onClick={this.closeEdit.bind(this)}>Close Edit Window</Button>
            </div>
          }

        </Form>

      </div>
    )
  }
}

const AddPost = Form.create()(AddPostForm);

export default AddPost;