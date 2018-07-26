import React, { Component } from 'react';
import { Button, message } from 'antd';

import PDF from './PDF';

class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      runNumber: this.props.getStore().runNumber,
      reportKey: this.props.getStore().reportKey,
      download: false,
    };
  }

  componentDidMount() {

  }

  previous() {
    return this.props.jumpToStep(4)
  }


  done() {
    //this.props.history.push('/reports')
    this.props.location === '/reports' ? window.location.reload('/reports') : this.props.history.push('/reports')
    message.success('Report #' + this.state.runNumber + ' has been saved')
    console.log(this.props.location)
  }

  render() {
    return (
    <div>
      <PDF reportInfo={this.props.getStore()} />
      <Button onClick={this.previous.bind(this)}>Pervious</Button>
      <Button onClick={this.done.bind(this)}>Complete</Button>
    </div>
    )
  }
}

export default Complete;