import React, { Component } from 'react';
import { Modal, Button, Col } from 'antd';

import CurrentlyOut from './CurrentlyOut';
import EquipmentOutForm from './EquipmentOutForm'
import SignOutLog from './SignOutLog'; 

import * as firebase from 'firebase';

var database = firebase.database();

class EquipmentSignOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      checkOuts: null,
      show: false
    };
  }

  componentDidMount() {
    var arrEquipment = []
    database.ref('equipment').on('value', function (snap) {
      arrEquipment = []
      snap.forEach(function (equipment) {
        arrEquipment.push(equipment.val())
      })
      this.setState({checkOuts: arrEquipment})
    }.bind(this));
  }
  
  signOutLog() {
    this.setState({show: true})
  }

  close(){
    this.setState({show: false})
  }

  render() {
    return (
      <div>
        <Col xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <div>
          <h2>Equipment Sign-Out</h2>
          {this.state.checkOuts ? <CurrentlyOut userName={this.props.name} checkOuts={this.state.checkOuts} />
            :
            "No Equipment Currently Out"}

          <EquipmentOutForm name={this.props.name} close={this.close.bind(this)} />
          <br />
          <a onClick={this.signOutLog.bind(this)}>Sign-Out Log</a>

          <Modal
            title='Equipment Sign-Out Log'
            visible={this.state.show}
            onCancel={this.close.bind(this)}
            footer={null}
          >

            <SignOutLog userName={this.state.name} checkOuts={this.state.checkOuts} />
            <br />
          </Modal>

        </div>
        </Col>
      </div>
    )
  }
}

export default EquipmentSignOut;