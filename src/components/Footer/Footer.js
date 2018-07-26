import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { auth } from '../firebase';
// import { Col, Row, message, Divider, Icon } from 'antd';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      window: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this))
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.setState({ window: window.innerWidth})
  }

  render(){

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "relative",
    overflow: 'hidden',
    left: "0",
    bottom: "0",
    height: "5.5em",
    width: "100%",
}

var phantom = {
  display: 'block',
  marginTop: '79vh'
//   padding: '20px',
//   height: '60px',
//   width: '100%',
}

    return(
      <div style={phantom}>
        <footer style={style}>
            <h3>WASHTENAW COUNTY TECHNICAL RESCUE TEAM &copy; {new Date().getFullYear()}</h3>
        </footer>
      </div>
    )
  }
}

export default Header;
