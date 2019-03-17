import React, { Component } from 'react';
import { auth } from './components/firebase';
import * as firebase from 'firebase';
import 'antd/dist/antd.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import PastReports from './components/Reports/PastReports';
import ReportsMaster from './components/Reports/ReportsMaster';
import GroupEmail from './components/GroupEmail/GroupEmail';
import Login from './components/Login/Login';
import Blog from './components/Blog/Blog';
import Posting from './components/Blog/Posting';
import Calendar from './components/Calendar/Calendar';
import EquipmentPDF from './components/EquipmentPDF/EquipmentPDFs';
import EquipmentSignOut from './components/EquipmentSignOut/EquipmentSignOut';
import SOPs from './components/SOPs/SOPs';
import TeamActivity from './components/TeamActivity/TeamActivity';
import TeamMembers from './components/TeamMembers/TeamMembers';
import TeamRoster from './components/TeamRoster/TeamRoster';
import TruckCheck from './components/TruckCheck/TruckCheck';
import UserProfile from './components/UserProfile/UserProfile';
import Example from './components/Example/Example'
import CreateUser from './components/CreateUser/CreateUser';
import AdminCertView from './components/AdminCertView/AdminCertView';
import Equipment from './components/Equipment/Equipment';
import CreateBusiness from './components/Business/CreateBusiness';
import BusinessPage from './components/Business/BusinessPage';
import Business from './components/Business/Business';

//import './Apps.css';
import './styles/fullcalendar.min.css'
//import './antd.css';

import { Button, notification } from 'antd';

var database = firebase.database();

class App extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

componentDidMount() {

 const that = this;

  auth.onAuthStateChanged(user => {
    if (user) {

      let user = auth.currentUser;

// Load User Data....

      database.ref('users/').orderByChild('email').equalTo(user.email).once("value", function (snap) {
        snap.forEach(function (data) {
          that.setState({ key: data.key })
        

      database.ref('users/' + data.key).on('value', function (snap) {
        that.setState({ 
            user: user,
            userId: data.key,
            member: snap.val(),
            name: snap.child('name').val(),
            admin: snap.child('admin').val(),
            business: snap.child('business').val(),
          });
        })
      })

    });

    } else {
      that.setState({
        userId: null,
        name: null,
        key: null,
        admin: false
      })
      console.log('no user');
    }
  })
}

  componentWillUnmount() {
    database.ref('users/' + this.props.userId).off();
  }

  render() { 

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.userId ? (
            this.state.business ? 
            <Redirect
            to={{
              pathname: `/business-page/${this.state.name}`,
            }}
          />
            :
            <Component {...props}
              userId={this.state.userId}
              user={this.state.user}
              name={this.state.name}
              admin={this.state.admin}/>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );

    const BusinessRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.userId ? (
            <Component {...props}
              userId={this.state.userId}
              user={this.state.user}
              name={this.state.name}
              />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
        }
      />
    );

    const AdminRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.admin ? (
            <Component {...props}
              userId={this.state.userId}
              user={this.state.user}
              name={this.state.name}
              admin={this.state.admin}/>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
        }
      />
    );

    return (
      <Router>
        <div>
          <Header admin={this.state.admin} name={this.state.name} />
          <Switch>

            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/reports" component={ReportsMaster} />
            <PrivateRoute path="/reports/:runNumber" component={PastReports} />
            <PrivateRoute path="/group-email" component={GroupEmail} />
            <PrivateRoute exact path="/blog" component={Blog} />
            <PrivateRoute path="/blog/:uid" component={Posting} />
            <PrivateRoute path="/user-profile" component={UserProfile} />
            <PrivateRoute exact path="/calendar" component={Calendar} />
            <PrivateRoute exact path="/equipmentPDFs" component={EquipmentPDF} />
            <PrivateRoute exact path="/equipment-sign-out" component={EquipmentSignOut} />
            <PrivateRoute exact path="/SOPs" component={SOPs} />
            <PrivateRoute exact path="/team-activity" component={TeamActivity} />
            <PrivateRoute exact path="/team-members" component={TeamMembers} />
            <PrivateRoute exact path="/team-roster" component={TeamRoster} />
            <PrivateRoute exact path="/truck-check" component={TruckCheck} />
            <PrivateRoute exact path="/equipmentPDFs" component={EquipmentPDF} />
            <PrivateRoute exact path="/team-certs" component={AdminCertView} />
            <AdminRoute exact path="/create-user" component={CreateUser} />

            <AdminRoute exact path="/create-business" component={CreateBusiness} />
            <BusinessRoute exact path="/business-page/:businessName" component={BusinessPage} />
            <PrivateRoute exact path="/Business" component={Business} />
            <PrivateRoute exact path="/equipment" component={Equipment} />

            <Route path="/login" render={() => (
              !this.state.userId ? (<Route component={(props) =>
                (<Login {...props} />)}
              />)
                : (<Route component={(props) =>
                  (<Login {...props} userId={this.state.userId} />)}
                />)
            )} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
