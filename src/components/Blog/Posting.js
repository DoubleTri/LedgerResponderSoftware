import React, { Component } from 'react';
import { Button, Popconfirm, Col } from 'antd';

import * as firebase from 'firebase';

import AddPost from './AddPost';

var database = firebase.database();

class Posting extends Component {
  constructor(props) {
    super(props);
    this.state = {
        blog: this.props.blog,
        admin: this.props.admin,
        userId: this.props.userId,
        name: this.props.name,
        uid: this.props.match.params.uid,
        currentPost: null,
        edit: false
    };
  }

  componentWillMount() {
    var arrBlog = []
    database.ref('blog').on('value', function (snap) {
        arrBlog = []
        snap.forEach(function (item) {
      arrBlog.push(item.val())
    })
      this.setState({ blog: arrBlog })

      var currentPost = [];
      
      arrBlog.map((post) => {
          if(this.props.match.params.uid === post.uid){
              currentPost.push({post})
          }
      return true
      })
      this.setState({ currentPost })

    }.bind(this))
  }

  edit() {
    this.setState({ edit: true })
  }

  delete() {
    var key;
    console.log(this.state.uid)
    database.ref('blog/').orderByChild('uid').equalTo(this.state.currentPost[0].post.uid).once("value", function (snap) {
      console.log(snap.val())
      snap.forEach(function (data) {
        console.log(data)
        key = data.key
      })
    })
    database.ref('blog/' + key).remove();
    this.props.history.push('/blog')
  }

  closeEdit() {
    this.setState({ edit: false })
  }

  render() {

    var edit = <div>
      <AddPost
        author={this.state.name}
        title={this.state.currentPost[0].post.title}
        new={false}
        text={this.state.currentPost[0].post.text}
        closeEdit={this.closeEdit.bind(this)}
      />
    </div>   
    
    var rendered = <div>
    <h3>{this.state.currentPost[0].post.title}</h3>
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.state.currentPost[0].post.text }}></div>
        <br />
        {this.state.currentPost[0].post.author === this.state.name ?
          <div>
            <Button onClick={this.edit.bind(this)}>Edit Post</Button>
            <Popconfirm title={"Are you sure you'd like to delete this post?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
                <Button>Delete</Button>
              </Popconfirm>
          </div>
          : null}
      </div>
  </div>

    return (
     <div>
       <Col xs={{span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} > 
      {this.state.edit? edit : rendered}
      </Col>
     </div>
    )
  }
}

export default Posting;