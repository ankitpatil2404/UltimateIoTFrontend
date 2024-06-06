import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Row,
  Input,
  Form,
  Button,
  FormGroup,
  Label,
  Col,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "reactstrap";
import Axios from "axios";
import { message, Space } from "antd";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../context/userContext";
import { server } from "../utils/server";

const Login = () => {
  const context = useContext(UserContext);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const warning = () => {
    message.error({
      content: "Unable To Login With Provided Credentials!",
      className: "custom-class",
      style: {
        marginTop: "10vh",
      },
    });
  };

  const success = () => {
    message.success(
      {
        content: "Logged in successfully.",
        className: "custom-class",
        style: {
          marginTop: "10vh",
        },
      },
      500
    );
  };
  const fetchDetails = async () => {
    try {
      await Axios.post(`${server}/user/login/`, {
        email: email,
        password: password,
      })
        .then((res) => {
          context.setUser(res.data.data);
          success();
        })
        .catch((err) => {
          warning();
        });
    } catch (error) {
      warning();
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(context.user));
  }, [fetchDetails]);

  if (context.user !== null) {
    return <Redirect to="/" />;
  } else {
    return (
      <Container className="text-center">
        <Row>
          <Col lg={6} className="offset-lg-3 mt-5">
            <Card>
              <Form>
                <CardHeader>
                  <h4>Log In here</h4>
                </CardHeader>
                <CardBody className="pb-0">
                  <FormGroup row>
                    <Label for="username" sm={3}>
                      <h6 className="txt-email">Email</h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your registered email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="password" sm={3}>
                      <h6 className="txt-password">Password</h6>
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your Password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="mt-2 mb-0" style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "10.5px", marginBottom: 0 }}>
                          <a href="/password-reset">Forgot Password?</a>
                        </p>
                      </div>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter className="m-0">
                  <Button
                    // type="submit"
                    block
                    color="primary"
                    onClick={fetchDetails}
                  >
                    Log In
                  </Button>
                  <p className="mt-3 mb-2">
                    Don't have an Account? <a href="/register">Register here</a>
                  </p>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Login;
