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

const AddChannel = () => {
  const context = useContext(UserContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);

  const handelCreation = async () => {
    try {
      let channelData = new FormData();
      channelData.append("name", name);
      channelData.append("description", description);
      channelData.append("fields", fields);

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
        url: `${server}/channel/create/`,
        method: "POST",
        data: channelData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        console.log(res);
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values) => {
    console.log(values);
    setName(values.user.name);
    setDescription(values.user.description);
    setFields(values.users.map((u) => u.Field));
  };

  useEffect(() => {
    if (fields.length > 0) {
      handelCreation();
    }
  }, [onFinish]);

  useEffect(() => {
    const localCreds = localStorage.getItem("user");
    if (localCreds) {
      context.setUser(JSON.parse(localCreds));
    }
    if (context.user?.token !== null) {
      history.push("/newch");
    }
  }, []);

  if (!context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Container className="mt-4">
        <Row>
          <h1>New Channel</h1>
        </Row>

        <Fm
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Fm.Item
            name={["user", "name"]}
            label="Name"
            labelCol={{ span: 24 }}
            rules={[{ required: true }]}
          >
            <In />
          </Fm.Item>
          <Fm.Item
            name={["user", "description"]}
            labelCol={{ span: 24 }}
            label="description"
          >
            <In.TextArea />
          </Fm.Item>
          <Fm.List name="users">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Fm.Item
                        {...field}
                        name={[field.name, "Field"]}
                        fieldKey={[field.fieldKey, "Field"]}
                        rules={[
                          { required: true, message: "Missing Field name" },
                        ]}
                      >
                        <In placeholder="Field Name" />
                      </Fm.Item>

                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  ))}

                  <Fm.Item>
                    <Btn
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> Add field
                    </Btn>
                  </Fm.Item>
                </>
              );
            }}
          </Fm.List>
          <Fm.Item>
            <Btn type="primary" htmlType="submit">
              Submit
            </Btn>
          </Fm.Item>
        </Fm>
      </Container>
    );
  }
};

export default AddChannel;
