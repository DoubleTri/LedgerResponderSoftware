import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { Modal, Button, Col, Row, message, Divider, Icon } from 'antd';
var logo = require('../../logo.svg')

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      show: false,
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

  signOut(e){
    auth.signOut();
    e.preventDefault();
  }

  notLoggedIn() {
    message.error('Please log in')
  }

  show() {
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false})
  }

  render(){

    var headerText;

    if (this.state.window > 992){
      headerText = 'Washtenaw County Technical Rescue Team'
    } else if (this.state.window > 767) {
      headerText = 'WCTRT'
    } else {
      headerText = ''
    }

    return(
      <div style={{ padding: '1.5em',  boxShadow: '0px 0px 15px grey', backgroundColor: '#F8CB16' }} >
        <header>
          <Row >
            {this.props.name ? <Col xs={{ span: 6 }} onClick={this.show.bind(this)} ><img src={require('../../patch.png')} alt='logo' height='85' width='110' /></Col> 
            : <Col xs={{ span: 6 }} onClick={this.notLoggedIn.bind(this)} ><img src={require('../../patch.png')} alt='logo' height='85' width='110' /></Col> }
            <Col xs={{ span: 6 }} md={{ span: 12 }} style={{ textAlign: 'center', fontWeight: 'Bold', fontSize: '2.4em', color: '#002652', marginTop: '12px' }}>{headerText}</Col>
            <Col xs={{ span: 12 }} md={{ span: 6 }} style={{ textAlign: 'right' }}>
              <Link to='/user-profile'>
                <p style={{ fontWeight: 'Bold', fontSize: '1.6em', color: '#002652', marginBottom: '-15px' }}>{this.props.name}</p>
              </Link>
              <br />
              {this.props.name ? <p onClick={this.signOut.bind(this)} style={{ marginTop: '-5px' }} >Log Out</p> : <Link to="https://www.facebook.com/WashtenawCountyTRT/" target="_blank" ><Icon style={{ fontSize: '24px',  color: '#002652' }} type="facebook" /></Link> }
            </Col>
          </Row>
           
          <Modal
            visible={this.state.show}
            onCancel={this.close.bind(this)}
            style={{ float: 'left', marginLeft: '1em', top: 20 }}
            closable={false}
            maskClosable={true}
            width={300}
            footer={null}
          >
            <nav style={{ fontSize: '1.25em' }}>
              <p><Link to="/" onClick={this.close.bind(this)}>Home</Link></p>
              <p><Link to="/blog" onClick={this.close.bind(this)}>Blog </Link></p>
              <p><Link to="/calendar" onClick={this.close.bind(this)}>Calendar </Link></p>
              <p><Link to="/team-members" onClick={this.close.bind(this)}>Team Members </Link></p>
              <p><Link to="/user-profile" onClick={this.close.bind(this)}>User Profile </Link></p>
              {/* <p><Link to="/login" onClick={this.close.bind(this)}>Login </Link></p> */}
              <p><Link to="/team-roster" onClick={this.close.bind(this)}>Team Roster </Link></p>
              <p><Link to="/equipment-sign-out" onClick={this.close.bind(this)}>Equipment Sign Out </Link></p>
              <p><Link to="/team-activity" onClick={this.close.bind(this)}>Team Activity </Link></p>
              <p><Link to="/truck-check" onClick={this.close.bind(this)}>Truck Check </Link></p>
              <p><Link to="/group-email" onClick={this.close.bind(this)}>Group Email </Link></p>
              <p><Link to="/reports" onClick={this.close.bind(this)}>Reports </Link></p>
              <p><Link to="/equipmentPDFs" onClick={this.close.bind(this)}>Equipment PDFs </Link></p>
              <p><Link to="/SOPs" onClick={this.close.bind(this)}>SOPs </Link></p>
              <p><Link to="/team-certs" onClick={this.close.bind(this)}>Team Certs </Link></p>
              <p><Link to="/equipment" onClick={this.close.bind(this)}>Equipment </Link></p>
              <p><Link to="/Business" onClick={this.close.bind(this)}>Business </Link></p>
              { this.props.admin ? 
                <div>
                  <Divider orientation="left">Admin</Divider>
                  <p><Link to="/create-user" onClick={this.close.bind(this)}>Create User </Link></p>
                  <p><Link to="/create-business" onClick={this.close.bind(this)}>Create Business </Link></p> 
                </div> 
              : null }
            </nav>
          </Modal>

        </header>
      </div>
    )
  }
}

export default Header;
