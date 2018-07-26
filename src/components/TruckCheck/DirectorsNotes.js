import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Input, Button, message } from 'antd';

var database = firebase.database();

class DirectorsNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: this.props.admin,
      text: null
    };
  }

  componentDidMount() {
    database.ref('directorsNotes/text').on('value', function (snap) {
      this.setState({ text: snap.val() })
      }.bind(this));
  }

  onChangeText(e) {
    this.setState({ text: e.target.value })
  }

  save() {
    database.ref('directorsNotes').update({text: this.state.text})
    message.success('Your notes have been saved');
  }

  render() {

    const { TextArea } = Input;

    return (
    <div>
      <TextArea 
        disabled={!this.state.admin} 
        onChange={this.onChangeText.bind(this)} 
        value={this.state.text} 
        rows={4} />
      {this.state.admin? <Button onClick={this.save.bind(this)}>Save</Button> : null }
    </div>
    )
  }
}

export default DirectorsNotes;