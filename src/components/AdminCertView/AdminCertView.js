import React, { Component } from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import { Modal, Col } from 'antd';
import { Link } from 'react-router-dom'
import * as firebase from 'firebase';

var database = firebase.database();

class AdminCertView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
    var arr = []
    database.ref('users/').once('value', function (snap) {
      arr = []
      snap.forEach(function (obj) {
        if(obj.child('URLs').val()){
          arr.push({name: obj.child('name').val(), URLs: obj.child('URLs').val()})
        }
      })
      this.setState({ obj: arr })
    }.bind(this));
  }
   
  open(url, user) {
    console.log(url.url)
    this.setState({ open: true, url: url.url, fileTitle: user + ': ' + url.fileTitle })
  }

  close() {
    this.setState({ open: false, url: null, fileTitle: null })
  }

  render() {
    var list = this.state.obj? this.state.obj.map((item, i) => {


      return <li key={i}>
        <b>{item.name}</b>
        <ul>
          {Object.values(item.URLs).map ((url, j) => {
            return <li style={{ marginLeft:'2em' }} onClick={this.open.bind(this, url, item.name)} key={ i + j }>{url.fileTitle}</li>
          })}
        </ul>
      </li>
      //console.log(item.name + ' ' + Object.values(item.URLs)[i].url)
    })
    :
    'loading...'

    return (
      <div>
        <Col xs={{ span: 18, offset: 3 }} lg={{ span: 10, offset: 7 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <h2>Team Member's Certificates</h2> 
          {this.state.obj ? <ul>{list}</ul> : ''}
        </Col>

{/* Image Modal */}
        <Modal
          title={this.state.fileTitle}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          <img src={this.state.url} alt='show cert' style={{ width: '100%' }} />

        </Modal>

    </div>
    )
  }
}

export default AdminCertView;
