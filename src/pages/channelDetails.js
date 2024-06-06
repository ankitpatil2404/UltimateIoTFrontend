import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
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
  Spinner,
  Col,
  Progress,
} from "reactstrap";
import { server } from "../utils/server";
import classnames from "classnames";

import { Redirect, Link, useHistory } from "react-router-dom";
import UserContext from "../context/userContext";
import { toast } from "react-toastify";
import {
  Layout,
  Menu,
  Breadcrumb,
  Button as Btn,
  Input as In,
  Form as Fm,
  InputNumber,
  Select,
  message,
} from "antd";
import Nav from "reactstrap/lib/Nav";
import NavItem from "reactstrap/lib/NavItem";
import NavLink from "reactstrap/lib/NavLink";
import TabContent from "reactstrap/lib/TabContent";
import TabPane from "reactstrap/lib/TabPane";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import ListGroup from "reactstrap/lib/ListGroup";

const ChannelDetails = (props) => {
  const { Option } = Select;
  const context = useContext(UserContext);
  const [fieldList, setFieldList] = useState([]);
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const history = useHistory();
  const [arr, setArr] = useState([]);
  // to limit the field count to 16
  var newArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const resetValue = async () => {
    const token = context.user?.token;
    console.log(token);
    await Axios({
      url: `${server}/channel/${props.match.params.id}/reset_value/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
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
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDetails = async () => {
    const token = context.user?.token;
    console.log(token);
    await Axios({
      url: `${server}/channel/${props.match.params.id}/`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        setFieldList(res.data.field_list);
        setData(res.data.data);
        setName(res.data.data.name);
        setDescription(res.data.data.description);
        setArr(res.data.field_list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateChannel = async () => {
    try {
      let channelData = new FormData();
      channelData.append("name", name);
      channelData.append("description", description);
      channelData.append(
        "fields",
        newArray.map((n, i) => fieldList[i])
      );

      const token = context.user?.token;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      await Axios({
        url: `${server}/channel/${props.match.params.id}/update/`,
        method: "POST",
        data: channelData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newReadApiKey = async () => {
    try {
      const token = context.user?.token;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      await Axios({
        url: `${server}/channel/${data.id}/generate_read_api_key/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        setData(res.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newWriteApiKey = async () => {
    try {
      const token = context.user?.token;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      await Axios({
        url: `${server}/channel/${data.id}/generate_write_api_key/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        setData(res.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChannel = async () => {
    try {
      const token = context.user?.token;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      await Axios({
        url: `${server}/channel/${data.id}/delete/`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const localCreds = localStorage.getItem("user");
    if (localCreds) {
      context.setUser(JSON.parse(localCreds));
    }
    history.push(`channel/${props.match.params.id}`);
  }, []);

  useEffect(() => {
    if (context.user) {
      fetchDetails();
    }
  }, [context.user]);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [fetchDetails]);

  if (!context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Container className="mt-4 mb-5">
        {loading === true ? (
          <div className="Center">
            <Spinner color="primary" />
            <div className="text-primary">Loading...</div>
          </div>
        ) : (
          <>
            <p className="ch-name mb-3">{data.name}</p>
            <p className="mb-4" style={{ fontSize: "15px" }}>
              {data.description}
            </p>
            <div>
              <p className="mb-0" style={{ fontSize: "15px" }}>
                Channel ID:{" "}
                <span style={{ fontWeight: "bolder" }}>{data.id}</span>
              </p>
              <p className="mb-0" style={{ fontSize: "15px" }}>
                Author:{" "}
                <span style={{ fontWeight: "light", color: "#36B34E" }}>
                  {data.user}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    API keys
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    Channel settings
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggle("3");
                    }}
                  >
                    Monitor
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <ListGroup className="mt-5">
                    <ListGroupItem active action style={{ fontSize: "18px" }}>
                      Read API Key
                    </ListGroupItem>
                    <ListGroupItem
                      action
                      style={{ fontSize: "18px", color: "black" }}
                    >
                      {data.read_api_key}
                    </ListGroupItem>
                  </ListGroup>
                  <Button
                    className="btn-secondary"
                    style={{
                      fontSize: "15px",
                      marginTop: "25px",
                    }}
                    onClick={newReadApiKey}
                  >
                    <span style={{ color: "white" }}>
                      Generate New Read API Key
                    </span>
                  </Button>

                  <ListGroup className="mt-5">
                    <ListGroupItem active action style={{ fontSize: "18px" }}>
                      Write API Key
                    </ListGroupItem>
                    <ListGroupItem
                      action
                      style={{ fontSize: "18px", color: "black" }}
                    >
                      {data.write_api_key}
                    </ListGroupItem>
                  </ListGroup>
                  <Button
                    className="btn-secondary"
                    style={{
                      fontSize: "15px",
                      marginTop: "25px",
                    }}
                    onClick={newWriteApiKey}
                  >
                    <span style={{ color: "white" }}>
                      Generate New Write API Key
                    </span>
                  </Button>
                </TabPane>
                <TabPane tabId="2">
                  <div>
                    <Col sm={8}>
                      <Form className="mt-5" onSubmit={updateChannel}>
                        <FormGroup>
                          <Label
                            style={{ fontWeight: "bold", fontSize: "17px" }}
                          >
                            Name
                          </Label>
                          <Input
                            className="pr-4 pt-4 pb-4"
                            style={{ fontSize: "15px" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            style={{ fontWeight: "bold", fontSize: "17px" }}
                          >
                            Description
                          </Label>
                          <Input
                            className="mt-2"
                            type="textarea"
                            style={{ fontSize: "15px", height: 150 }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            style={{ fontWeight: "bold", fontSize: "17px" }}
                            className="m-0"
                          >
                            Fields
                          </Label>
                          {/*Conditional rendering to change color of blank field*/}
                          {newArray.map((e, index) => (
                            <>
                              <Input
                                className="mt-2 pr-4 pt-4 pb-4"
                                value={fieldList[index]}
                                style={{
                                  fontSize: "15px",
                                  background: "white",
                                }}
                                placeholder="Add new field"
                                onChange={(e) => {
                                  setFieldList({
                                    ...fieldList,
                                    [index]: e.target.value,
                                  });
                                  console.log(fieldList);
                                }}
                              />
                            </>
                          ))}
                        </FormGroup>
                        <FormGroup>
                          <Button
                            className="btn-info"
                            style={{
                              fontSize: "15px",
                              marginTop: "10px",
                            }}
                            type="submit"
                          >
                            Update Channel
                          </Button>
                        </FormGroup>
                      </Form>
                      <Button
                        className="btn-danger"
                        style={{
                          fontSize: "15px",
                          marginTop: "10px",
                        }}
                        onClick={deleteChannel}
                      >
                        Delete Channel
                      </Button>
                    </Col>
                  </div>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col lg={7}>
                      <div className="mt-5">
                        {arr.map((field, i) => (
                          <div className="mb-4">
                            <Row>
                              <Col
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  textAlign: "right",
                                  paddingTop: "10px",
                                }}
                                lg={4}
                              >
                                <h4 className="field-name">{field} : </h4>
                              </Col>
                              <Col>
                                <In
                                  className="pt-3 pb-3"
                                  value={
                                    data.data[field] != -999999999
                                      ? data.data[field]
                                      : "N/A"
                                  }
                                  style={{ color: "black" }}
                                  color="black"
                                  disabled
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          className="btn-danger reset-btn"
                          style={{
                            fontSize: "15px",
                            marginTop: "10px",
                            marginLeft: "18.52rem",
                          }}
                          onClick={resetValue}
                        >
                          Reset Values
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <div className="mt-5">
                        <h1>Help</h1>
                        <p>
                          API keys enable you to write data to a channel or read
                          data from a channel. API keys are auto-generated when
                          you create a new channel.
                        </p>
                        <h1>Api Key Settings</h1>
                        <p>
                          {" "}
                          If you feel your key has been compromised, Go to{" "}
                          <a
                            style={{
                              color: "#343AB5",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              toggle("1");
                            }}
                          >
                            Api Keys
                          </a>{" "}
                          section and click on Generate New Write API Key. (same
                          for read API key)
                        </p>
                        <h1>Api Requests</h1>
                        <p style={{ color: "#1890FF" }}>
                          Read the data from channel fields
                        </p>
                        <In
                          type="text"
                          style={{ fontSize: "15px", height: 50, color: "red" }}
                          value={`${server}/channel/read/API_KEY=${data.read_api_key}/`}
                          readOnly={true}
                          addonBefore={"GET"}
                        />
                        <p className="mt-4" style={{ color: "#1890FF" }}>
                          Write the data to the channel fields
                        </p>
                        <In
                          type="text"
                          style={{ fontSize: "15px", height: 50, color: "red" }}
                          value={`${server}/channel/write/API_KEY=${data.write_api_key}/?field1=0&field2=0`}
                          readOnly={true}
                          addonBefore={"GET"}
                        />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </>
        )}
      </Container>
    );
  }
};

export default ChannelDetails;
