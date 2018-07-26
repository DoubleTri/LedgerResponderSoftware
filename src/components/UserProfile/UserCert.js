import React, { Component } from 'react';
import { storage } from '../firebase';
import * as firebase from 'firebase';
import { Popconfirm, Modal, Button, Input, message, Row, Col } from 'antd';

var database = firebase.database();
var storageRef = storage.ref();

class UserCert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      userId: this.props.userId,
      image: [],
      title: null,
      loading: false,
      url: null,
      key: null,
      titleOver: null,
      uploadLabel: true,
      loadedFile: null,
      fileTitle: null
    };
  }

  componentDidMount() {
    var arr = []
    database.ref('users/' + this.state.userId).child('URLs').on('value', function (snap) {
      arr = []
      snap.forEach(function (obj) {
        arr.push(obj.val())
      })
      this.setState({ image: arr })
    }.bind(this));
  }

  clicked() {
    this.setState({ loadedFile: null, uploadLabel: true })
  }

  store(e) {
    this.setState({ loadedFile: e.target.files[0] })
  }

  onChangeTitle(e) {
    this.setState({ fileTitle: e.target.value })
  }

  test(e) {
    var that = this;
    var fileTitle = this.state.fileTitle;
    var fileUpload = this.state.loadedFile;
    var name = this.state.name;
    var userId = this.state.userId;
    var fileSend = storage.ref(name + '/' + fileTitle);
    var task = fileSend.put(fileUpload);
  
    this.setState({ loading: true })

    task.on("state_changed", function (snap) {
      var percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      if (percentage === 100) {

        setTimeout(function() {storageRef.child(name + '/' + fileTitle).getDownloadURL().then(function (url) {
          
          var firebaseRef = database.ref('users/' + userId).child('URLs');
          var data = {
            url: url,
            fileTitle: fileTitle,
            name: fileUpload.name,
            status: 'done'
          }
          firebaseRef.push(data).then(function () {
            message.success(fileTitle + ' has been added to your profile');
          }).then(() => {
            that.setState({loadedFile: null, fileTitle: null, uploadLabel: true, loading: false})
          })
        })},3000)
      }
    })
  }

  open(url, title) {
    var that = this;
    database.ref('users/' + this.state.userId + '/URLs').orderByChild('url').equalTo(url).once("value", function (snap) {
      snap.forEach(function (data) {
        that.setState({key: data.key, open: true, title: title, url: url, fileTitle: data.child('fileTitle').val() })
      });
    })
  }

  close() {
    this.setState({ key: null, open: false, title: null, url: null, fileTitle: null })
  }

  delete() {
    var desertRef = storageRef.child(this.state.name + '/' + this.state.title);

    desertRef.delete().then(function () {
      console.log('success')
    }).catch(function (error) {
      console.log(error)
    });

    database.ref('users/' + this.state.userId + '/URLs/' + this.state.key).remove();
    
    this.setState({ key: null, open: false, title: null, url: null })
  }

  render() {
    var list = this.state.image.map((item, i) => {
      return <li key={i} onClick={this.open.bind(this, item.url, item.fileTitle)} style={{ marginLeft: '2em' }}>
        <div><img src={item.url} alt={item.fileTitle} style={{ width: '10%' }} /> {item.fileTitle}</div>
      </li>
    })
    return (
      <div>
      <h3>{this.props.name}'s Certificates</h3>
      <br />
        <div className="image-upload">
          <label htmlFor="file-input">
            <a>{ this.state.uploadLabel ? 'Upload Certificates' : null }</a>
          </label>      
          <input id="file-input" type="file" accept=".JPG, .png, .jpeg" onClick={this.clicked.bind(this)} onChange={this.store.bind(this)} />
        </div>

        <br />

        {this.state.loadedFile ?
          <div style={{ marginBottom: '15px', marginTop: '5px'}} >
            <Input id='fileTitle' placeholder='Enter Certificate Name' onChange={this.onChangeTitle.bind(this)} />
            {this.state.fileTitle?  <Button loading={this.state.loading} onClick={this.test.bind(this)}>Submit</Button> : null }
          </div>
          :
          null
        }

        {this.state.image ? <ul>{list}</ul> : ''}

        {/* Image Modal */}
        <Modal
          title={this.state.fileTitle}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          <img src={this.state.url} alt='show cert' style={{ width: '100%' }} />

          <Popconfirm title={"Are you sure you'd like to delete " + this.state.title + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
            <a style={{ color: 'red' }}>Delete Cert</a>
          </Popconfirm>

        </Modal>
      </div>
    );
  }
}

export default UserCert;