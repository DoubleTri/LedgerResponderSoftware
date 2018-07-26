import React, { Component } from 'react';
import { Table, Modal, Button } from 'antd';

class H2oActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rosters: this.props.rosters,
      users: this.props.users,
      show: false,
      name: null,
      info: null
    };
  }

  componentDidMount() {

    var data = [];
    var trainings = [];
    var incidents = [];
    var truckCheck = [];
    var team = [];

    if (this.state.users){ 
      this.state.users.forEach(function (name) {
        if (name.water === 'Yes'){ team.push(name) } 
      })
    }  
      
    this.setState({ team })

    this.state.rosters.forEach(function (datum) {

      if(datum.type === "Monthly Training - H2O"){
        trainings.push({ date: datum.date, title: datum.runOrTitle, members: datum.members })
        data.push(datum)
      }else if(datum.type === "Truck Check"){
        truckCheck.push({ date: datum.date, title: datum.runOrTitle, members: datum.members })
        data.push(datum)
      }else if (datum.type === "Water Rescue"){
        incidents.push({ date: datum.date, runNumber: datum.runOrTitle, members: datum.members })
        data.push(datum)
      }
    })
    this.setState({
      data: data,
      events: this.state.rosters.length,
      trainings: trainings,
      trainingsTotal: trainings.length,
      truckCheck: truckCheck,
      truckCheckTotal: truckCheck.length,
      incidents: incidents,
      incidentsTotal: incidents.length
    })
  }

  show(item) {

    var arr = [];

    this.state.rosters.map((roster) => {
      roster.members.map((member) => {
        if(member === item.name) {arr.push({ type: roster.type, date: roster.date, description: roster.description })}
      return true
      })
      this.setState({ info: arr })
      return true
    })
    this.setState({ show: true, name: item.name })
  }

  close() {
    this.setState({ show: false, name: null })
  }

  render() {

    const columns = [
      { title: 'Name', width: 175, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: <div><b>Trainings</b> <p style={{ fontSize: "10px" }}> Year to Date: {this.state.trainingsTotal} </p></div>, width: 150, dataIndex: 'trainings', key: 'trainings' },
      { title: <div><b>Incidents</b> <p style={{ fontSize: "10px" }}> Year to Date: {this.state.incidentsTotal} </p></div>, width: 150, dataIndex: 'incidents', key: 'incidents' },
      { title: <div><b>Truck Checks</b> <p style={{ fontSize: "10px" }}> Year to Date: {this.state.truckCheckTotal} </p></div>, width: 150, dataIndex: 'truckChecks', key: 'truckChecks' },
      { title: <div><b>Total</b></div>, width: 150, dataIndex: 'total', key: 'total' },
    ];

    var trainingAttended = [];
    var incidentAttended = [];
    var truckCheckAttended = [];

    var trainingTotal = (name) => {
      trainingAttended = [];
        this.state.trainings.map((item) => {
          item.members.map((newItem) => {
            if (name === newItem) {trainingAttended.push({ date: item.date, type: item.type, description: item.description, members: item.members })}
            return true
          })
          return true
        })
      return (<div>{trainingAttended.length} of {this.state.trainingsTotal}</div>)
    }

    var incidentsTotal = (name) => {
      incidentAttended = [];
        this.state.incidents.map((item) => {
          item.members.map((newItem) => {
            if (name === newItem) {incidentAttended.push({ date: item.date, title: item.title })}
            return true
          })
          return true
        })
      return (<div>{incidentAttended.length} of {this.state.incidentsTotal}</div>)
    }

    var truckCheckTotal = (name) => {
      truckCheckAttended = [];
      this.state.truckCheck.map((item) => {
        item.members.map((newItem) => {
          if (name === newItem) {truckCheckAttended.push({ date: item.date, title: item.title })}
          return true
        })
        return true
      })
      return (<div>{truckCheckAttended.length} of {this.state.truckCheckTotal}</div>)
    }

    var totalPartcipation = (name) => {
      return (Math.floor(((trainingAttended.length + incidentAttended.length + truckCheckAttended.length) / (this.state.data.length - this.state.truckCheckTotal)) * 100) + "%")
    }

    // ------------------------------------------------------------------------------------------------------    

    const data = [];

    if (this.state.team) {
      this.state.team.map((item) => {
        var name = item.name
        return data.push({
          key: item.name,
          name: <div onClick={this.show.bind(this, item)}><b>{item.name}</b> <p style={{ fontSize: "10px" }}> {item.title} </p></div>,
          trainings: trainingTotal(name),
          incidents: incidentsTotal(name),
          truckChecks: truckCheckTotal(name),
          total: totalPartcipation(name)
        });
      })
    }

    return (
      <div>

        <Table columns={columns} dataSource={data} scroll={{ x: 775, y: 500 }} pagination={false} />

        {/* Contact Info */}
        <Modal
          title={this.state.name}
          visible={this.state.show}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          {this.state.info ?
            <ul>
              {this.state.info.map((item, i) => {
                return (<li key={i}>{item.date}: {item.type === 'Specialized Training' ? item.description : item.type}</li>)
              })
              }
            </ul>
            : 'Nothing attended'}
          <br />
          <Button onClick={this.close.bind(this)}>Close</Button>

        </Modal>
   
      </div>
    )
  }
}

export default H2oActivity;