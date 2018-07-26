import React, { Component } from 'react';
import { storage } from '../firebase';
import * as firebase from 'firebase';
import { Popconfirm, Modal, Button, Input, message } from 'antd';

var database = firebase.database();
var storageRef = storage.ref();

class ReportPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: this.props.getStore().runNumber,
      reportKey: this.props.getStore().reportKey,
      image: [],
      loading: false,
      title: null,
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
    var that = this

    database.ref('reports/' + this.state.reportKey).child('URLs').on('value', function (snap) {
      arr = []
      snap.forEach(function (obj) {
        arr.push(obj.val())
      })
      that.setState({ image: arr })
    });
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
    var runNumber = this.state.runNumber;
    var fileSend = storage.ref(runNumber + '/' + fileUpload.name);
    var task = fileSend.put(fileUpload);

    this.setState({ loading: true })
  

    task.on("state_changed", function (snap) {
      var percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      if (percentage === 100) {

         setTimeout(function() {storageRef.child(runNumber + '/' + fileUpload.name).getDownloadURL().then(function (url) {
          
          var firebaseRef = database.ref('reports/' + that.state.reportKey).child('URLs');
          var data = {
            url: url,
            fileTitle: fileTitle,
            name: fileUpload.name,
            status: 'done'
          }
          firebaseRef.push(data).then(function () {
            message.success('Photo added');
          }).then(() => {
            that.setState({loadedFile: null, fileTitle: null, uploadLabel: true, loading: false})
          })
        })},3000)
      }
    })
  }

  done() {
    return this.props.jumpToStep(4)
  }

  open(url, title) {
    var that = this;
    database.ref('reports/' + this.state.reportKey + '/URLs').orderByChild('url').equalTo(url).once("value", function (snap) {
      snap.forEach(function (data) {
        that.setState({key: data.key, open: true, title: title, url: url, fileTitle: data.child('fileTitle').val() })
      });
    })
  }

  close() {
    this.setState({ key: null, open: false, title: null, url: null, fileTitle: null })
  }

  delete() {
    var desertRef = storageRef.child(this.state.runNumber + '/' + this.state.title);

    desertRef.delete().then(function () {
      console.log('success')
    }).catch(function (error) {
      console.log(error)
    });

    database.ref('reports/' + this.state.reportKey + '/URLs/' + this.state.key).remove();
    
    this.setState({ key: null, open: false, title: null, url: null })
  }

  previous() {
    return this.props.jumpToStep(2)
  }

  render() {
    var list = this.state.image.map((item) => {
      return <li key={item.name} onClick={this.open.bind(this, item.url, item.name)}>
        <div><img src={item.url} alt={item.name} style={{ width: '20%', margin: '15px' }} /> {item.fileTitle}</div>
      </li>
    })
    return (
      <div>

        <div className="image-upload">
          <label htmlFor="file-input">
            <a>{ this.state.uploadLabel ? 'Upload Incident Photos (optional) ' : null }</a>
          </label>      
          <input id="file-input" type="file" accept=".JPG, .png, .jpeg" onClick={this.clicked.bind(this)} onChange={this.store.bind(this)} />
        </div>

        <br />

        {this.state.loadedFile ?
          <div>
            <Input id='fileTitle' placeholder='Photo description' onChange={this.onChangeTitle.bind(this)} style={{ width: '50%', margin: '15px' }}/>
            {this.state.fileTitle?  <Button loading={this.state.loading} onClick={this.test.bind(this)}>Submit</Button> : null }
          </div>
          :
          null
        }

        {this.state.image ? <ul>{list}</ul> : ''}

        <Button onClick={this.previous.bind(this)}>Previous</Button> <Button onClick={this.done.bind(this)}>Next</Button>

        {/* Image Modal */}
        <Modal
          title={this.state.fileTitle}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          <img src={this.state.url} alt='show cert' style={{ width: '100%' }} />

          <Popconfirm title={"Are you sure you'd like to delete " + this.state.title + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
            <a style={{ color: 'red' }}>Delete</a>
          </Popconfirm>

        </Modal>
      </div>
    );
  }
}

export default ReportPhotos;