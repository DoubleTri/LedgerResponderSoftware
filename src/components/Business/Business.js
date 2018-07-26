import React, { Component } from 'react';
//import { auth } from '../firebase';
import * as firebase from 'firebase';
import { Form, Icon, Input, Button, Checkbox, Col, Tooltip, message, InputNumber, Modal } from 'antd';

const FormItem = Form.Item;
var database = firebase.database();

class Business extends Component {

  constructor(props) {
    super(props);
    this.state = {
        open: false,
        openMaterial: false 
    }
  }

    componentDidMount() {
        var arr = []
        database.ref('users/').once('value', function (snap) {
          arr = []
          snap.forEach(function (obj) {
            if(obj.child('business').val()){
              arr.push(obj.val())
            }
          })
          this.setState({ obj: arr })
        }.bind(this));
    }

    open(item) {
        this.setState({ open: true, business: item })
      }
    
    close() {
        this.setState({ open: false, business: null })
      }

    openMaterial(item, material) {
        this.setState({ openMaterial: true, business: item, material: material })
      }
    
    closeMaterial() {
        this.setState({ openMaterial: false, business: null, material: null })
      }



  render() {

    var list = this.state.obj? this.state.obj.map((item, i) => {
        return <li key={i}>
          <div onClick={this.open.bind(this, item)} ><b>{item.name}</b> {item.address}</div>
          <ul>
            {item.addItem ? item.addItem.map ((material, j) => {
              return <li style={{ marginLeft:'2em' }} key={ i + j } onClick={this.openMaterial.bind(this, item, material)}>{material.item}</li>
            }): <p style={{ marginLeft:'2em' }}><i>No Materials Listed</i></p>}
          </ul>
          <hr />
        </li>
        
      })
      :
      'loading...'


    return (
      <div>
            <Col xs={{ span: 18, offset: 4 }} md={{ span: 14, offset: 6 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
                <h2>Businesses</h2>
                {this.state.obj ? <ul>{list}</ul> : ''}
            </Col>

{/* Business Info Modal */}
        <Modal
          title={this.state.business ? this.state.business.name : 'loading...'}
          visible={this.state.open}
          onCancel={this.close.bind(this)}
          footer={null}
        >
          {this.state.business ? <div>
            <p><b>Address: </b>{this.state.business.address}</p>
            <p><b>Business Phone: </b>{this.state.business.businessPhone}</p>
            <hr />
            <p><b>HazMat Team's Contact for {this.state.business.name}</b></p>
            <p><b>name: </b>{this.state.business.contact}</p>
            <p><b>email: </b>{this.state.business.email}</p>
            <p><b>phone: </b>{this.state.business.phone}</p>
            {this.state.business.phoneSecond ? <p><b>secondary phone: </b>{this.state.business.phoneSecond}</p> : null} 
            </div>: 'loading...'}
        </Modal>

{/* Material Info Modal */}
        <Modal
          title={this.state.material ? this.state.material.item : 'loading...'}
          visible={this.state.openMaterial}
          onCancel={this.closeMaterial.bind(this)}
          footer={null}
        >
          {this.state.material ? <div>
            <p><b>Quantity: </b>{this.state.material.quantity}</p>
            <p><b>Location: </b>{this.state.material.location}</p>
            {this.state.material.notes ? <p><b>notes: </b>{this.state.material.notes}</p> : null} 
            </div>: 'loading...'}

        </Modal>

      </div>
    );
  }
}

export default Business;