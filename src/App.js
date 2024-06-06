import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "antd/dist/antd.css";
import "./App.css";

import MyNavbar from "./layouts/navbar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import PageNotFound from "./pages/pageNotFound";
import Home from "./pages/home";
import Register from "./pages/register";
import AddChannel from "./pages/addChannel";
import UserContext from "./context/userContext";
import ChannelDetails from "./pages/channelDetails";
import ContactUs from "./pages/contactUs";
import AboutUs from "./pages/aboutUs";
import PasswordReset from "./pages/passwordReset";
import PasswordResetForm from "./pages/passwordResetForm";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    // <div className="App">
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <MyNavbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/newch" component={AddChannel} />
          <Route exact path="/channel/:id" component={ChannelDetails} />
          <Route exact path="/contact_us" component={ContactUs} />
          <Route exact path="/about_us" component={AboutUs} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/password-reset" component={PasswordReset} />
          <Route
            exact
            path="/user/password-reset/:uidb64/:token"
            component={PasswordResetForm}
          />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </UserContext.Provider>
    </Router>
    // </div>
  );
};

export default App;
