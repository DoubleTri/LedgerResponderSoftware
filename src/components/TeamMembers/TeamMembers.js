import React, { Component } from 'react';
import { Table, Modal, Button, Col, Tooltip, Icon } from 'antd';

import * as firebase from 'firebase';

var database = firebase.database();

class TeamMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: null,
      show: false,
      member: {}
    };
  }

  componentWillMount() {
    var team = []
    database.ref('users').once('value', function (snap) {
      snap.forEach(function (item) {
        if (item.child('visable').val() !== "No"){
          team.push(item.val())
        }
      })
      this.setState({ team: team.sort((a, b) => a.lastName.localeCompare(b.lastName)) })
    }.bind(this));
  }

  contactInfo(item) {
    this.setState({show: true, member: item})
  }

  close() {
    this.setState({show: false, member: {}})
  }

  render() {

    const columns = [
      { title: 'Name', width: 175, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: 'Department', width: 150, dataIndex: 'department', key: 'department' },
      { title: 'Medical License', width: 150, dataIndex: 'medicalLicense', key: 'medicalLicense' },
      { title: 'Firefighter', width: 150, dataIndex: 'firefighter', key: 'firefighter' },
      { title: 'Fire Officer', width: 150, dataIndex: 'fireOfficer', key: 'fireOfficer' },
      { title: 'Staff And Command', width: 175, dataIndex: 'staffAndCommand', key: 'staffAndCommand' },
      { title: 'ICS', width: 100, dataIndex: 'ICS', key: 'ICS' },
      { title: 'UICS', width: 100, dataIndex: 'UICS', key: 'UICS' },
      { title: 'RIT', width: 100, dataIndex: 'RIT', key: 'RIT' },
      { title: 'Haz Mat', width: 150, dataIndex: 'hazardousMaterials', key: 'hazardousMaterials' },
      { title: 'Swift Water', width: 150, dataIndex: 'swiftWater', key: 'swiftWater' },
      { title: 'Rope Rescue', width: 150, dataIndex: 'ropeRescue', key: 'ropeRescue' },
      { title: 'Tower Rescue', width: 150, dataIndex: 'towerRescue', key: 'towerRescue' },
      { title: 'Confined Space', width: 150, dataIndex: 'confinedSpace', key: 'confinedSpace' },
      { title: 'Trench Rescue', width: 150, dataIndex: 'trenchRescue', key: 'trenchRescue' },
      { title: 'Structural Collapse', width: 175, dataIndex: 'structuralCollapse', key: 'structuralCollapse' },
      { title: 'Ice Rescue', width: 150, dataIndex: 'iceRescue', key: 'iceRescue' },
      { title: 'Open Water Rescue', width: 175, dataIndex: 'openWaterRescue', key: 'openWaterRescue' },
      { title: 'SCUBA', width: 125, dataIndex: 'SCUBA', key: 'SCUBA' },
      { title: 'Vehicle Extrication', width: 150, dataIndex: 'vehicleExtrication', key: 'vehicleExtrication' },
      { title: 'School Bus Extrication', width: 175, dataIndex: 'schoolBusExtrication', key: 'schoolBusExtrication' },
      { title: 'Agricutural Rescue', width: 175, dataIndex: 'agricuturalRescue', key: 'agricuturalRescue' },
      { title: 'Large Truck', width: 150, dataIndex: 'largeTruck', key: 'largeTruck' },
      { title: 'Machinery Rescue', width: 150, dataIndex: 'machineryRescue', key: 'machineryRescue' },
      { title: 'USAR Medical', width: 150, dataIndex: 'USARMedical', key: 'USARMedical' },
      { title: 'USAR Heavy Rigging', width: 175, dataIndex: 'USARHeavyRigging', key: 'USARHeavyRigging' },
      { title: 'Grain Bin', width: 150, dataIndex: 'grainBin', key: 'grainBin' },
    ];
    
    const data = [];
    
    if (this.state.team) {
      this.state.team.map((item) => {
        data.push({
          key: item.name,
          name: <div onClick={this.contactInfo.bind(this, item)} style={{ cursor: 'pointer' }}>
            <b>{item.name}</b>
            <p style={{ fontSize: "10px" }}> {item.title} </p>
          </div>,
          department: item.department,
          medicalLicense: item.medicalLicense,
          firefighter: item.firefighter,
          fireOfficer: item.fireOfficer,
          staffAndCommand: item.staffAndCommand,
          ICS: item.ICS,
          UICS: item.UICS,
          RIT: item.RIT,
          hazardousMaterials: item.hazardousMaterials,
          swiftWater: item.swiftWater,
          ropeRescue: item.ropeRescue,
          towerRescue: item.towerRescue,
          confinedSpace: item.confinedSpace,
          trenchRescue: item.trenchRescue,
          structuralCollapse: item.structuralCollapse,
          iceRescue: item.iceRescue,
          openWaterRescue: item.openWaterRescue,
          SCUBA: item.SCUBA,
          vehicleExtrication: item.vehicleExtrication,
          schoolBusExtrication: item.schoolBusExtrication,
          agricuturalRescue: item.agricuturalRescue,
          largeTruck: item.largeTruck,
          mechineryRescue: item.mechineryRescue,
          USARMedical: item.USARMedical,
          USARHeavyRigging: item.USARHeavyRigging,
          grainBin: item.grainBin
        });
        return true
      })
    }

    return (
      <div>
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 4 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        
        <div><h2>Team Members 
          <Tooltip placement="right" title="Click a team member's name to see their contact info">
            <Icon style={{ fontSize: '12px', marginLeft: '10px' }} type="question-circle" />
          </Tooltip></h2></div>

          <Table columns={columns} dataSource={data} scroll={{ x: 4050, y: 600 }} pagination={false} />

          {/* Contact Info */}
          <Modal
            title={this.state.member ? this.state.member.name : ''}
            visible={this.state.show}
            onCancel={this.close.bind(this)}
            footer={null}
          >
            <h3>Contact Info</h3>

            <b>Phone Number: </b> {this.state.member.phone}
            <br />
            <b>Email: </b> {this.state.member.email}
            <br />
            <hr />

            <h3>Emergency Contact Info</h3>

            <b>Emergency Contact Name: </b> {this.state.member.emergencyContact}
            <br />
            <b>Relationship: </b> {this.state.member.emergencyRelationship}
            <br />
            <b>Emergency Contact's Phone: </b> {this.state.member.emergencyPhone}
            <br />
            <b>Emergency Contact's Address: </b> {this.state.member.emergencyAddress}

            <br />
            <hr />
            <br />

            <Button onClick={this.close.bind(this)}>Close</Button>

          </Modal>
        </Col>
      </div>
    )
  }
}

export default TeamMembers;