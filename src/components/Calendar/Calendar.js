import React, { Component } from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import { Modal, Col } from 'antd';
import * as firebase from 'firebase';

import Events from './Event';
import CreateEvent from './CreateEvent';

var database = firebase.database();

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      events: null,
      showCalEvent: false,
      showEvent: '',
      title: '', 
      eventInfo: '',
      startTime: '', 
      endTime: '',
      showDay: false,
      admin: this.props.admin,
      clickedDay: '',
      ISOString: '',
      start: '',
      eventKey: '',
      startDate: ''
    }
  }

  componentDidMount() {
    var arrEvents = []
    database.ref('events').on('value', function (snap) {
      arrEvents = []
      snap.forEach(function (event) {
        arrEvents.push(event.val())
      })
      this.setState({events: arrEvents})
    }.bind(this));
  }

  day (date) {
    if(this.state.admin === true){
      this.setState({ 
        showDay: true, 
        clickedDay: date.format("dddd, MMMM D, YYYY"),
        ISOString: date.toISOString(),
      })  
    }
  }

  event(calEvent) {

    var that = this
    var key = '';

    database.ref('events').orderByChild('start').equalTo(calEvent.start._i).once("value", function (snap) {

      snap.forEach(function (data) {
        key = data.key
      });

      var ref = database.ref('events/' + key);
      ref.once("value")
        .then(function (snap) {
          that.setState({
            eventKey: key,
            start: snap.child("start").val(),
            startDate: calEvent.start.format("dddd, MMMM D, YYYY"),
            title: snap.child("title").val(),
            startTime: snap.child("startTime").val(),
            endTime: snap.child("endTime").val(),
            eventInfo: snap.child("eventInfo").val(),
            showCalEvent: true
          })
        })
    })
  }

  closeDay(){
    this.setState({ 
      showDay: false, 
      clickedDay: '',
      ISOString: '',
    });
  }

  close(){
    this.setState({ 
      showCalEvent: false
    })  
  }
  
  render() {

    return (
      <div>
          <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em'  }} > 
          <h2>Events Calendar</h2>
        <FullCalendar
             id = "calendar"
         header = {{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'month,listYear'
          }}
          defaultDate={new Date()}
          navLinks= {true} // can click day/week names to navigate views
          editable= {false}
          displayEventTime={false}
          dayClick={(date) => this.day(date)}
          eventClick={(calEvent) => this.event(calEvent)}
          eventLimit= {true} // allow "more" link when too many events
          events = {this.state.events}
          	
        />

{/* Day */}
        <Modal
          title={this.state.clickedDay}
          visible={this.state.showDay}
          onCancel={this.closeDay.bind(this)}
          footer={null}
        >
          <CreateEvent 
            ISOString={this.state.ISOString}
            clickedDay={this.state.clickedDay} 
            close={this.closeDay.bind(this)} 
          />
        </Modal>

{/* Events  */}
        <Modal
          title={this.state.startDate}
          visible={this.state.showCalEvent}
          closable={false}
          footer={null}
        >
        <Events
          close={this.close.bind(this)}
          admin={this.state.admin}
          title={this.state.title}
          start={this.state.start}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          eventInfo={this.state.eventInfo}
          eventKey={this.state.eventKey}
        /> 
        </Modal>
      </Col>
      </div>
    );
  }
}

export default Calendar;

