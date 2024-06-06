import React, { useEffect, useContext, useState } from "react";
import {
  Row,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import { Form as Fm, Input as In, Button as Btn, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Redirect, Link, useHistory } from "react-router-dom";
import UserContext from "../context/userContext";
import Axios from "axios";
import { server } from "../utils/server";

const AboutUs = () => {
  const context = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const localCreds = localStorage.getItem("user");
    if (localCreds) {
      context.setUser(JSON.parse(localCreds));
    }
    if (context.user?.token !== null) {
      history.push("/about_us");
    }
  }, []);

  if (!context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div>
        <h1>AboutUs page</h1>
      </div>
    );
  }
};

export default AboutUs;
