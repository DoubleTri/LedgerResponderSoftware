import React, { Component } from 'react';
import { Button, Modal, Col } from 'antd';
import * as firebase from 'firebase';

import ChangePassword from './ChangePassword';
import UserCert from './UserCert';
import EditProfile from './EditProfile';

var database = firebase.database();

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      user: this.props.user,
      member: null,
      show: false,
      edit: false
    };
  }

  componentDidMount() {
    database.ref('users/' + this.props.userId).on('value', function (snap) {
      this.setState({
        member: snap.val()
      });
    }.bind(this))
  }

  changePassword() {
    this.setState({
      show: true
    })
  }

  close() {
    this.setState({
      show: false
    })
  }

  edit() {
    this.setState({ edit: true })
  }

  saved() {
    this.setState({ edit: false })
  }

  render() {

    const profile = (<div>
    {this.state.member ?
      <div>
        <b>Name:</b> {this.state.member.name}<br />
        <b>Email:</b> {this.state.member.email}<br />
        <b>Phone Number:</b> {this.state.member.phone}<br />
        <b>Department:</b> {this.state.member.department}<br />
        <hr />
        <b>Emergency Contact Name:</b> {this.state.member.emergencyContact} <br />
        <b>Relationship:</b> {this.state.member.relationship} <br />
        <b>Emergency Contact's Phone:</b> {this.state.member.emergencyPhone} <br />
        <b>Emergency Contact's Address:</b> {this.state.member.emergencyAddress} <br />
        <hr />
        <b>Medical License:</b> {this.state.member.medicalLicense} <br />
        <b>Fire Fighter:</b> {this.state.member.fireFighter} <br />
        <b>Fire Officer:</b> {this.state.member.fireOfficer} <br />
        <b>Staff And Command:</b> {this.state.member.staffAndCommand} <br />
        <b>ICS:</b> {this.state.member.ICS} <br />
        <b>UICS:</b> {this.state.member.UICS} <br />
        <b>RIT:</b> {this.state.member.RIT} <br />
        <b>Hazardous Materials:</b> {this.state.member.hazardousMaterials} <br />
        <b>Swift Water:</b> {this.state.member.swiftWater} <br />
        <b>Rope Rescue:</b> {this.state.member.ropeRescue} <br />
        <b>Tower Rescue:</b> {this.state.member.towerRescue} <br />
        <b>Confined Space:</b> {this.state.member.confinedSpace} <br />
        <b>Trench Rescue:</b> {this.state.member.trenchRescue} <br />
        <b>Structural Collapse:</b> {this.state.member.structuralCollapse} <br />
        <b>Ice Rescue:</b> {this.state.member.iceRescue} <br />
        <b>Open Water Rescue:</b> {this.state.member.openWaterRescue} <br />
        <b>SCUBA:</b> {this.state.member.SCUBA} <br />
        <b>Vehicle Extrication:</b> {this.state.member.vehicleExtrication} <br />
        <b>School Bus Extrication:</b> {this.state.member.schoolBusExtrication} <br />
        <b>Large Truck:</b> {this.state.member.largeTruck} <br />
        <b>Agricultural Rescue:</b> {this.state.member.agriculturalRescue} <br />
        <b>Machinery Rescue:</b> {this.state.member.machineryRescue} <br />
        <b>USAR Medical:</b> {this.state.member.USARMedical} <br />
        <b>USAR Heavy Rigging:</b> {this.state.member.USARHeavyRigging} <br />
        <b>Grain Bin Rescue:</b> {this.state.member.grainBin} <br />
        <b>misc: </b>{this.state.member.misc} <br />
        <br />

        <Button onClick={this.edit.bind(this)} style={{ marginBottom: '15px' }} >Edit Profile</Button>
        <br />
        <hr />

        {/* Upload files and certs */}

        <UserCert name={this.state.member.name} userId={this.state.userId} />

        <hr />

        {/* Change Password Modal */}

        <a onClick={this.changePassword.bind(this)}>Change Password</a>

      

      <Modal
        title="Password Change"
        visible={this.state.show}
        onCancel={this.close.bind(this)}
        footer={null}
      >
        <ChangePassword close={this.close.bind(this)} user={this.state.user} />

      </Modal>

    </div>
      : 'loading...'}  

  </div>)

    return (
      <div>
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
          <h2>{this.props.name}'s User Profile</h2>
        {this.state.edit ? <EditProfile userId={this.state.userId} saved={this.saved.bind(this)} /> : profile}
        </Col>
      </div>
    )
  }
}

export default UserProfile;