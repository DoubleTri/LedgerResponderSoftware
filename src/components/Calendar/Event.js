import React, { Component } from 'react';
import { Button } from 'antd';

import EditEvent from './EditEvent';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.ISOString,
      title: this.props.title,
      eventInfo: this.props.eventInfo,
      eventKey: this.props.eventKey,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      admin: this.props.admin,
      edit: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      start: nextProps.ISOString,
      title: nextProps.title,
      startTime: nextProps.startTime,
      endTime: nextProps.endTime,
      eventInfo: nextProps.eventInfo,
      eventKey: nextProps.eventKey,
    });
  }

  edit() {
    this.setState({
      edit: true
    })
  }

  close() {
    var that = this;
    this.props.close();
    setTimeout(function () {
      that.setState({
        edit: false
      })
    }, 1000)
  }

  render() {

    return (
      <div>
        {this.state.edit ? <EditEvent
          close={this.close.bind(this)}
          start={this.state.ISOString}
          title={this.state.title}
          eventInfo={this.state.eventInfo}
          eventKey={this.state.eventKey}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />

          :

          <div>
            <h3>{this.state.title}</h3>

            {this.state.startTime !== '' ? <p>{this.state.startTime} to {this.state.endTime}</p> : ''}

            <p>{this.state.eventInfo}</p>

            {this.state.admin === true ?
              <Button onClick={this.edit.bind(this)}>Edit Event</Button>
              : ''}

            <Button onClick={this.close.bind(this)}>Close</Button>
          </div>

        }

      </div>
    );
  }
}


export default Events;