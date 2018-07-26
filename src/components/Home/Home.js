import React, { Component } from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import { Modal, Col } from 'antd';
import { Link } from 'react-router-dom'
import * as firebase from 'firebase';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Events from '../Calendar/Event'

var database = firebase.database();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalEvent: false
    };
  }

  componentDidMount() {
    var arrEvents = []
    var now = moment()
    database.ref('events').on('value', function (snap) {
      arrEvents = []
      snap.forEach(function (event) {
        if (now.isAfter(event.child('start').val())){
          console.log( event.child('start').val() )
        } else {
          arrEvents.push(event.val())
        }
      })
      this.setState({events: arrEvents})
    }.bind(this));

    var arrBlog = []
    database.ref('blog').on('value', function (snap) {
        arrBlog = []
        snap.forEach(function (item) {
      arrBlog.push(item.val())
    })
      this.setState({ blog: arrBlog })
    }.bind(this))

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
  
  close(){
    this.setState({ 
      showCalEvent: false
    })  
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
            <Col  style={{ border: '0.25px solid lightGray', marginTop: '15px' }} >
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
        <Col xs={{ span: 24 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} > 

        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <b style={{ fontSize: '18px' }}>Upcoming Events/Trainings</b> 
        <FullCalendar
          id="calendarHome"
          defaultView= 'listYear'
          header={false}
          height={300}
          editable={false}
          displayEventTime={false}
          eventClick={(calEvent) => this.event(calEvent)}
          eventLimit={true} // allow "more" link when too many events
          events={this.state.events}
        />
        </Col>

        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
        <b style={{ fontSize: '18px' }}>Announcements</b> 
            {posts}
        </Col>

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
    )
  }
}

export default Home;
