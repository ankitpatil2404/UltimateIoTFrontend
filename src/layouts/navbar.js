import React, { useState, useContext, useEffect } from "react";
import {
  Navbar,
  Collapse,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarText,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "../context/userContext";
import { server } from "../utils/server";
import { message } from "antd";

const MyNavbar = () => {
  const context = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const Toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar
      color="dark"
      light
      expand="md"
      className="text-white pr-3 pl-3 mb-2 sticky-top"
    >
      <NavbarBrand>
        <h3 className="text-white mt-2">Techq Konnect</h3>
      </NavbarBrand>
      {/* <NavbarText className="text-white mb-1 text-lowercase">
        {context.user ? "Welcome " + context.user?.username : ""}
      </NavbarText> */}
      <NavbarToggler onClick={Toggle} />
      <Collapse isOpen={isOpen} navbar>
        {context.user?.token ? (
          <>
            <Nav navbar className="mr-auto">
              <NavLink className="text-white" tag={Link} to="/">
                Home
              </NavLink>

              <NavLink className="text-white" tag={Link} to="/about_us">
                About
              </NavLink>

              <NavLink className="text-white" tag={Link} to="/contact_us">
                Contact Us
              </NavLink>
            </Nav>

            <Nav navbar className="ml-auto">
              <NavLink
                className="text-white p-4 logout"
                tag={Link}
                onClick={() => {
                  context.setUser(null);
                  localStorage.setItem("user", null);
                  message.success({
                    content: `Logged out successfully`,
                    className: "custom-class",
                    style: {
                      marginTop: "10vh",
                    },
                  });
                }}
              >
                Log Out
              </NavLink>
            </Nav>
          </>
        ) : (
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink className="text-white" tag={Link} to="/register">
                Register
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" tag={Link} to="/login">
                Log in
              </NavLink>
            </NavItem>
          </Nav>
        )}
      </Collapse>
    </Navbar>
  );
};

export default MyNavbar;
