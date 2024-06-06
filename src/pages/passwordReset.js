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

const PasswordReset = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handelRequest = async () => {
    setLoading(true);
    try {
      await Axios.post(`${server}/user/request-reset-email/`, {
        email: email,
      })
        .then((res) => {
          console.log(res);
          const success = () => {
            message.success(
              {
                content: `${res.data.success}`,
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
          setEmail(null);
          history.push("/login");
        })
        .catch((err) => {
          const error = () => {
            message.error(
              {
                content:
                  "Please enter the mail ID which is associated to your account",
                className: "custom-class",
                style: {
                  marginTop: "10vh",
                },
              },
              500
            );
          };
          error();
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
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
                  <h4>Request Password Reset</h4>
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

export default PasswordReset;
