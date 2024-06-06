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
  Spinner,
} from "reactstrap";
import Axios from "axios";
import { message, Space } from "antd";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../context/userContext";
import { server } from "../utils/server";

const PasswordResetForm = (props) => {
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const history = useHistory();

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

  const error = () => {
    message.error(
      {
        content: "Enter Valid Password.",
        className: "custom-class",
        style: {
          marginTop: "10vh",
        },
      },
      500
    );
  };

  const handelRequest = async () => {
    if (isValid && password === password2) {
      setLoading(true);
      try {
        await Axios.patch(
          `${server}/user/${props.match.params.uidb64}/${props.match.params.token}/password-reset-complete/`,
          {
            password: password,
            password2: password2,
          }
        )
          .then((res) => {
            console.log(res);
            const success = () => {
              message.success(
                {
                  content: `${res.data.message}`,
                  className: "custom-class",
                  style: {
                    marginTop: "10vh",
                  },
                },
                500
              );
            };
            success();
            setLoading(false);
            history.push("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      error();
    }
  };

  return (
    <Container className="text-center">
      {loading === true ? (
        <div className="Center">
          <Spinner color="primary" />
          <div className="text-primary">Sending...</div>
        </div>
      ) : (
        <Row>
          <Col lg={6} className="offset-lg-3 mt-5">
            <Card>
              <Form>
                <CardHeader>
                  <h4>Set New Password</h4>
                </CardHeader>
                <CardBody className="pb-0">
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
                        placeholder="Enter new Password..."
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
                        placeholder="Confirm new Password..."
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
                <CardFooter className="m-0">
                  <Button
                    // type="submit"
                    block
                    color="primary"
                    onClick={handelRequest}
                  >
                    Send Request
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PasswordResetForm;
