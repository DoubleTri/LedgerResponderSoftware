import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Modal, Button, Col } from 'antd';

import * as firebase from 'firebase';

import AddPost from './AddPost';

var database = firebase.database();

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: null,
      admin: this.props.admin,
      userId: this.props.userId,
      name: this.props.name,
      posts: [],
      edit: false,
      postKey: '',
      valueTitle: '',
      valueBody: '',
      show: false
    };
  }

  componentDidMount() {
    var arrBlog = []
    database.ref('blog').on('value', function (snap) {
        arrBlog = []
        snap.forEach(function (item) {
      arrBlog.push(item.val())
    })
      this.setState({ blog: arrBlog })
    }.bind(this))
  }

  addPosting() {
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false })
  }

  render() {

    var posts = this.state.blog? <div>
      <ul>
      {this.state.blog.map((post, i) => {

          var yourString = post.text; //replace with your string.
          var maxLength = 800 // maximum number of characters to extract
          //trim the string to the maximum length
          var trimmedString = yourString.substr(0, maxLength);
          //re-trim if we are in the middle of a word
          trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

          return <li key={i}
            >
            <Col  style={{ border: '0px solid black', borderRadius: '15px', boxShadow: '0px 0px 15px grey', margin: '15px' }} >
              <Link to={`/blog/${post.uid}`}>
                <div
                  style={{ padding: '15px' }}>
                  <h3><p><b>{post.title}</b></p></h3>
                  <div dangerouslySetInnerHTML={{ __html: trimmedString + '...(click to read on)' }}></div>
                </div>
              </Link>
            </Col>
          </li>
        })
      }
      </ul>
    </div>
    : 
    null

    return (
    <div>
      <Col xs={{span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} > 
      <h2>WCTRT Blog</h2>
        <Button onClick={this.addPosting.bind(this)}>Add Posting</Button>

        {posts}

      {/* Adding a post */}
      <Modal
          title="WCTRT Blog Posting"
          visible={this.state.show}
          onCancel={this.close.bind(this)}
          footer={null}
          width={1200}
        >
          <AddPost 
            author={this.state.name}
            close={this.close.bind(this)} 
            new={true}
          />

        </Modal>
        </Col>
    </div>
    )
  }
}

export default Blog;