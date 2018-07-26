import React, { Component } from 'react';

class NameForms extends Component {

  constructor(props) {
    super(props);
    this.state = {
      members: this.props.members,
      presentMembers: []
    }
  }

  onToggle(index, e) {
    this.props.change(index, e, this.state.members);
  }

  render() {

    return (
      <div>
        <ul>
          {this.state.members.map((item, i) =>
            <li key={i}>
              <input type="checkbox" disabled={this.props.disabled}
                onChange={this.onToggle.bind(this, i)}
                defaultChecked={item.checked === true ? true : false}
              />
              {item.member}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default NameForms;