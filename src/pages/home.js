import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";

import {
  Row,
  Container,
  Col,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  Spinner,
  Table,
} from "reactstrap";
import { FaSearch } from "react-icons/fa";
import { server } from "../utils/server";

import { Redirect, Link, useHistory } from "react-router-dom";
import UserContext from "../context/userContext";
import { toast } from "react-toastify";
import { Layout, Menu, Breadcrumb } from "antd";
import ChannelList from "../components/channelList";

const Home = () => {
  const context = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const fetchChannels = async () => {
    const token = context.user?.token;

    await Axios({
      url: `${server}/channel/list/`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    const localCreds = localStorage.getItem("user");
    if (localCreds) {
      context.setUser(JSON.parse(localCreds));
    }
    if (context.user?.token) {
      fetchChannels();
    }
  }, []);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [fetchChannels]);

  if (!context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Container className="mt-4">
        {loading === true ? (
          <div className="Center">
            <Spinner color="primary" />
            <div className="text-primary">Loading...</div>
          </div>
        ) : (
          <>
            <Row>
              <h1>My Channels</h1>
            </Row>
            <Row>
              <Col md={16}>
                <Button
                  className="btn-success btn-add"
                  style={{
                    fontSize: "18px",
                    marginTop: "8px",
                  }}
                  tag={Link}
                  to={`/newch`}
                >
                  + New Channel
                </Button>
              </Col>

              <Col sm={6}>
                <InputGroup>
                  <Input
                    style={{
                      fontSize: "18px",
                      marginTop: "8px",
                    }}
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      className="pb-2 pl-4 pr-4"
                      style={{ marginTop: "8px" }}
                      color="secondary"
                      type="submit"
                    >
                      <FaSearch style={{ width: "1.3rem", height: "1.3rem" }} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
            {data.data.length > 0 ? (
              <Table bordered className="device-list">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Device Name</th>
                    <th>Created at</th>
                  </tr>
                </thead>
                {data.data.map((cList, index) => (
                  <ChannelList
                    key={index}
                    c_id={cList.id}
                    number={index + 1}
                    name={cList.name}
                    des={cList.description}
                    date={cList.created_at}
                    channel_list={data}
                    setData={setData}
                  />
                ))}
              </Table>
            ) : null}
          </>
        )}
      </Container>
    );
  }
};

export default Home;
