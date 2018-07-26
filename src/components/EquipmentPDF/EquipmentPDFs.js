import React, { Component } from 'react';
import { storage } from '../firebase';
import * as firebase from 'firebase';
import { Popconfirm, Modal, Button, Input, message, Icon, Col } from 'antd';
import { Document, Page  } from 'react-pdf/dist/entry.webpack';

var database = firebase.database();
var storageRef = storage.ref();

class EquipmentPDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: null,
      reportKey: null,
      loading: false,
      files: [],
      title: null,
      url: null,
      key: null,
      titleOver: null,
      uploadLabel: true,
      loadedFile: null,
      fileTitle: null,
      open: false,
      width: null,
      numPages: null,
      pageNumber: 1,
    };
  }

  componentDidMount() {
    console.log(window.innerWidth)
    window.addEventListener("resize", this.updateWidth.bind(this));
    var arr = []
    database.ref('equipmentPDFs/').on('value', function (snap) {
      arr = []
      snap.forEach(function (obj) {
        arr.push(obj.val())
      })
      this.setState({ files: arr })
    }.bind(this));

    if(window.innerWidth > 740){
      this.setState({ modalWidth: window.innerWidth - 200, docWidth: window.innerWidth - 240 })
    }else{
      this.setState({ modalWidth: window.innerWidth - 50, docWidth: window.innerWidth - 70 })
    }
  }

  updateWidth() {
    this.setState({ width: window.innerWidth})
    if(window.innerWidth > 740){
      this.setState({ modalWidth: window.innerWidth - 200, docWidth: window.innerWidth - 240 })
    }else{
      this.setState({ modalWidth: window.innerWidth - 50, docWidth: window.innerWidth - 70 })
    }
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
    var fileSend = storage.ref('EquipmentPDFs/' + fileUpload.name);
    var task = fileSend.put(fileUpload);
  
    this.setState({ loading: true })

    task.on("state_changed", function (snap) {
      var percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      if (percentage === 100) {

        setTimeout(function() {storageRef.child('EquipmentPDFs/' + fileUpload.name).getDownloadURL().then(function (url) {
          
          var firebaseRef = database.ref('equipmentPDFs/');
          var data = {
            url: url,
            fileTitle: fileTitle,
            name: fileUpload.name,
            status: 'done'
          }
          firebaseRef.push(data).then(function () {
            message.success(fileTitle + ' has been added to your profile');
          }).then(() => {
            that.setState({loadedFile: null, fileTitle: null, uploadLabel: true})
          })
        })},4000)
      }
    })
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }
 

  open(url, title, fileTitle) {
    var that = this;
    var key = '';

    database.ref('equipmentPDFs').orderByChild('url').equalTo(url).once("value", function (snap) {
      snap.forEach(function (data) {
        key = data.key
      });
      database.ref('equipmentPDFs/' + key).once('value', function (snap) {
        snap.forEach(function (data) {
          // console.log(data.child('fileTitle'))
          that.setState({key: key, title: title, url: url, fileTitle: fileTitle })
        });
        that.setState({ open: true })
      });
    })
  }

  close() {
    this.setState({ key: null, open: false, title: null, url: null, fileTitle: null })
  }

  delete() {
    var desertRef = storageRef.child('EquipmentPDFs/' + this.state.title);

    desertRef.delete().then(function () {
      console.log('success')
    }).catch(function (error) {
      console.log(error)
    });

    database.ref('equipmentPDFs/' + this.state.key).remove();
    
    this.setState({ key: null, open: false, title: null, url: null })
  }

  pageBack(e) {
    e.preventDefault()
    this.setState({ pageNumber: this.state.pageNumber - 1 })
  }

  pageForward(e) {
    e.preventDefault()
    this.setState({ pageNumber: this.state.pageNumber + 1 })
  }

  render() {

    const { pageNumber, numPages } = this.state;

    var list = this.state.files.map((item) => {
      return <li key={item.name} onClick={this.open.bind(this, item.url, item.name, item.fileTitle)}>
        <div><b>{item.fileTitle}</b></div>
        <br />
      </li>
    })

    return (
      <div>
        <Col xs={{ span: 20, offset: 2 }} sm={{ span: 12, offset: 6 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <h2>Equipment Manuals</h2>
        <br />


        {this.state.loadedFile ?
            <div style={{ marginBottom: '15px', marginTop: '5px' }} >
              <Input id='fileTitle' placeholder='Enter Equipment Manual Title' onChange={this.onChangeTitle.bind(this)} />
              {this.state.fileTitle ? <Button loading={this.state.loading} onClick={this.test.bind(this)}>Submit</Button> : null}
            </div>
            :
          null
        }

        {this.state.files ? <ul>{list}</ul> : ''}

          <br />

          <div className="image-upload">
            <label htmlFor="file-input">
              <a>{this.state.uploadLabel ? 'Upload Equipment Manuals (pdf files)  ' : null}</a>
            </label>
            <input id="file-input" type="file" accept=".pdf" onClick={this.clicked.bind(this)} onChange={this.store.bind(this)} />
          </div>


        {/* Image Modal */}
        <Modal
          title={this.state.fileTitle}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          width={this.state.modalWidth}
          footer={null}
        >
          <div>
            <Document
              file={this.state.url}
              onLoadSuccess={this.onDocumentLoad}
              >
              <Page pageNumber={pageNumber} width={this.state.docWidth} />
            </Document>
            <center>
              <p><b>Page {pageNumber} of {numPages}</b></p>
              <p><b><Icon onClick={this.pageBack.bind(this)} style={{ marginRight: '50px' }} type="arrow-left" />
                <Icon onClick={this.pageForward.bind(this)} style={{ marginLeft: '50px' }} type="arrow-right" /></b></p>
            </center>
          </div>
        
          {this.props.admin ?   
          <Popconfirm title={"Are you sure you'd like to delete " + this.state.title + "?"} okText="Yes" cancelText="No" onConfirm={this.delete.bind(this)}>
            <a style={{ color: 'red' }}>Delete</a>
          </Popconfirm>
          : null }

        </Modal>
        </Col>
      </div>
    );
  }
}

export default EquipmentPDF;