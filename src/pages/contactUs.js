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
  Card,
} from "reactstrap";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Form as Fm,
  Input as In,
  Button as Btn,
  Space,
  message as Ms,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Redirect, Link, useHistory } from "react-router-dom";
import UserContext from "../context/userContext";
import Axios from "axios";
import { server } from "../utils/server";

const ContactUs = () => {
  const context = useContext(UserContext);
  const history = useHistory();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enqFor, setEnqFor] = useState("Individual");
  const [orgName, setOrgname] = useState("");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    try {
      let contactData = new FormData();
      contactData.append("full_name", fullName);
      contactData.append("email", email);
      contactData.append("enquiry_for", enqFor);
      contactData.append("org_name", orgName);
      contactData.append("message", message);
      contactData.append("country", country);
      contactData.append("phone", "+" + phone);

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
        url: `${server}/channel/contact/`,
        method: "POST",
        data: contactData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        console.log(res.data.data);
        Ms.success(
          {
            content: `${res.data.data}`,
            className: "custom-class",
            style: {
              marginTop: "11vh",
            },
          },
          500
        );
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const localCreds = localStorage.getItem("user");
    if (localCreds) {
      context.setUser(JSON.parse(localCreds));
    }
    if (context.user?.token !== null) {
      history.push("/contact_us");
    }
  }, []);

  if (!context.user?.token) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Container style={{ textAlign: "center", height: "140vh" }}>
        <div>
          <h1 className="mt-4">Contact Us</h1>
          <p className="address" style={{ textAlign: "left" }}>
            <span style={{ fontWeight: "bolder" }}>Address:</span> Techq Konnect
            Technologies Pvt. Ltd., Off. No. 203, 2nd Floor, Maruti Chambers II,{" "}
            <br></br>
            Beside Vasai Bus Depot, Vasai West, Maharashtra – 401202.
            <br></br>
            <span style={{ fontWeight: "bolder" }}>Contact No</span> :(+91)
            9870332716 / 7304129121
            <br></br>
            <span style={{ fontWeight: "bolder" }}>Email ID</span>{" "}
            :info@techqkonnect.com
          </p>
        </div>
        <div>
          <h1 className="mt-5">Ask your queries</h1>
          <Card
            body
            style={{
              backgroundColor: "#fafafa",
              maxWidth: "640px",
              marginLeft: "18rem",
            }}
          >
            <Form className="contact-form" onSubmit={(e) => handleSubmit(e)}>
              <FormGroup>
                <Label for="Name">
                  <span style={{ color: "red" }}>*</span>Full name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="Name"
                  placeholder="Enter your full name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={true}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">
                  <span style={{ color: "red" }}>*</span>Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="Enter your mail ID..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Phone">Phone no.</Label>
                <PhoneInput
                  style={{ padding: "-10px" }}
                  id="Phone"
                  country={"in"}
                  value={phone}
                  onChange={(val) => setPhone(val)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Enquiring for</Label>
                <Input
                  className="select-fm"
                  type="select"
                  name="select"
                  id="exampleSelect"
                  value={enqFor}
                  onChange={(e) => setEnqFor(e.target.value)}
                >
                  <option className="options">Individual</option>
                  <option className="options">Organization</option>
                </Input>
              </FormGroup>
              {enqFor === "Organization" ? (
                <FormGroup>
                  <Label for="organizationName">Organization name</Label>
                  <Input
                    type="text"
                    name="orgName"
                    id="organizationName"
                    placeholder="Enter Organization name..."
                    value={orgName}
                    onChange={(e) => setOrgname(e.target.value)}
                  />
                </FormGroup>
              ) : null}

              <FormGroup>
                <Label for="country">
                  <span style={{ color: "red" }}>*</span>Country
                </Label>
                <br></br>
                <CountryDropdown
                  className="pt-1 pb-1 pl-3"
                  style={{
                    borderRadius: "5px",
                    border: "solid #cccccc 1px",
                    fontColor: "#aaaaaa",
                    fontSize: "16px",
                    width: "100%",
                  }}
                  id="country"
                  required={true}
                  value={country}
                  onChange={(val) => setCountry(val)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">
                  <span style={{ color: "red" }}>*</span>Message
                </Label>
                <Input
                  type="textarea"
                  name="text"
                  style={{ height: 120 }}
                  id="exampleText"
                  required={true}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{ textAlign: "center" }}>
                <Button className="btn btn-info" type="submit">
                  Send
                </Button>
              </FormGroup>
            </Form>
          </Card>
        </div>
      </Container>
    );
  }
};

export default ContactUs;
