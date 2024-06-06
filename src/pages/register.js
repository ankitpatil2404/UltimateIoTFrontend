import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Row,
  Input,
  Form,
  Button,
  FormGroup,
  Dropdown,
  Label,
  Col,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "reactstrap";
import { message, Space } from "antd";

import { server } from "../utils/server";

import Axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../context/userContext";
import { Redirect, useHistory } from "react-router-dom";
import { Select, Radio } from "antd";

function Register() {
  const context = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState("");
  const [password2, setPassword2] = useState("");
  const history = useHistory();

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
    float: "left",
  };

  const validate = (event) => {
    event.preventDefault();
    var pass = password;
    var reg = new RegExp(
      "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{7,20}$"
    );
    var test = reg.test(pass);
    console.log(test);

    if (test) {
      setIsValid(true);
    }
  };

  const handleSignUp = async () => {
    try {
      await Axios.post(`${server}/user/register/`, {
        username: username,
        email: email,
        password: isValid ? password : ".",
        password2: isValid ? password2 : ".",
      }).then((res) => {
        console.log(res);
        if (res.data.status === 400) {
          const warning = () => {
            message.warning({
              content: `${res.data.data}`,
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          };
          warning();
        }
        if (res.data.data.token) {
          history.push("/login");
        }
      });
    } catch (error) {
      const warning = () => {
        message.error({
          content: `Enter a valid password`,
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      };
      warning();
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(context.user));
  }, [handleSignUp]);

  if (context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Container className="text-center">
        <Row>
          <Col lg={6} className="offset-lg-3 mt-5">
            <Card>
              <Form>
                <CardHeader className="">
                  <h4>Register here</h4>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Label for="username" sm={3}>
                      <h6 className="txt-username">Username</h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username..."
                        value={username}
                        required={true}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="email" sm={3}>
                      <h6 className="txt-email">Email</h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your Email..."
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="password" sm={3}>
                      <h6 className="txt-password">Set Password</h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="password"
                        name="password"
                        style={
                          isValid && password.length > 7
                            ? { border: "2px solid #5AC625" }
                            : { border: "2px solid #ff9999" }
                        }
                        id="password"
                        placeholder="Enter your Password..."
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                        onInput={validate}
                      />
                      <div className="mt-2" style={{ textAlign: "left" }}>
                        <li style={{ fontSize: "9px" }}>
                          Must contains one digit from 0-9
                        </li>
                        <li style={{ fontSize: "9px" }}>
                          Must contains one lowercase and characters
                        </li>

                        <li style={{ fontSize: "9px" }}>
                          must contains one special symbols in the list{" "}
                          <span style={{ color: "red" }}>"@#$%"</span>
                        </li>
                        <li style={{ fontSize: "9px" }}>
                          length at least 7 characters
                        </li>
                      </div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="password2" sm={3}>
                      <h6
                        className="txt-password2"
                        style={{ fontSize: "11px" }}
                      >
                        Confirm Password
                      </h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="password"
                        name="password2"
                        id="password2"
                        required={true}
                        placeholder="Enter your Password..."
                        style={
                          isValid &&
                          password.length > 7 &&
                          password === password2
                            ? { border: "2px solid #5AC625" }
                            : { border: "2px solid #ff9999" }
                        }
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    // type="submit"
                    block
                    color="primary"
                    onClick={handleSignUp}
                  >
                    Register
                  </Button>
                  <p className="mt-3 mb-2">
                    Already have an Account? <a href="/login">Log in here</a>
                  </p>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Register;
