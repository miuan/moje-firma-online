import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Register from "./containers/public/Login/Register";
import Login from "./containers/public/Login/Login";
import ForgottenPassword from "./containers/public/Login/ForgottenPassword";
import ForgottenPasswordReset from "./containers/public/Login/ForgottenPasswordReset";
import VerifyUser from "./containers/public/Login/VerifyUser";
import { GithubCallback } from "./containers/public/Login/utils/GithubCallback";

import Home from "./containers/public/Home/Home";
import Header from "./components/Header/Header";
import UserDashboard from "./containers/user/UserDashboard/UserDashboard";
import ProtectRoute from "./components/ProtectRoute/ProtectRoute";
import UsersList from "./containers/admin/Users/UsersList";
import UserRolesList from "./containers/admin/UserRoles/UserRolesList";
import OrganizationList from "./gen/Organization/List";
import OrganizationEdit from "./containers/user/Organization/Edit";
import CustomerList from "./gen/Customer/List";
import CustomerEdit from "./gen/Customer/Edit";
import InvoiceList from "./gen/Invoice/List";
import InvoiceEdit from "./containers/user/Invoice/Edit";

import './App.css'
import OrganizationRoute from "./components/ProtectRoute/OrganizationRoute";

export default function App() {

  return (
        <Router basename={process.env.PUBLIC_URL}>
          <div>
              <Header />
            {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route path="/login/facebook" >
                <GithubCallback type={'facebook'} />
              </Route>
              <Route path="/login/github" >
                <GithubCallback type={'github'} />
              </Route>
              <Route path="/login/google" >
                <GithubCallback type={'google'} />
              </Route>
              <Route path="/register">
                <Register />
              </Route>

              <Route path="/forgotten-password/:token" component={ForgottenPasswordReset} />
              <Route exact path="/forgotten-password">
                <ForgottenPassword />
              </Route>
              
              
              <Route path="/verify-user/:verifyToken" component={VerifyUser} />
              
              <OrganizationRoute path="/user/dashboard" children={<UserDashboard />} />
              <ProtectRoute exact path="/user/organizations"  children={<OrganizationList />} />
              <ProtectRoute path="/user/organizations/:id" children={<OrganizationEdit />} />
              <ProtectRoute path="/user/organizations/:id/primary" children={<OrganizationEdit primary={true}/>} />
              
              <ProtectRoute exact path="/user/customers" children={<CustomerList />} />
              <ProtectRoute path="/user/customers/:id" children={<CustomerEdit />} />

              <OrganizationRoute exact path="/user/invoices" children={<InvoiceList />} />
              <OrganizationRoute path="/user/invoices/:id" children={<InvoiceEdit />} />

              <Route path="/user/info">
                {/* <UserInfo /> */}
              </Route>
              
              <ProtectRoute path="/admin/users" role={'admin'}>
                <UsersList adminMode={true}/>
              </ProtectRoute>
              <ProtectRoute path="/admin/roles" role={'admin'}>
                <UserRolesList adminMode={true}/>
              </ProtectRoute>
{/*              
              <Route path="/user/roles/create" component={UserRoleEdit} />
              <Route path="/user/roles/:id" component={UserRoleEdit} /> */}
            </Switch>
          </div>
        </Router>
  );
}

// You can think of these components as "pages"
// in your app.


function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}


