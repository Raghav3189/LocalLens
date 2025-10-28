import React from "react";
import styled from "styled-components";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <NavbarContainer>
      <Brand>LocalLens</Brand>
      <NavList>
        <NavItem onClick={ () => navigate("/")}>Home</NavItem>
        <NavItem onClick={ () => navigate("/h")}>Test</NavItem>
        <NavItem>Profile</NavItem>
      </NavList>
      <ButtonGroup>
        <Button text="Login" onClick={() => navigate("/login")} />
        <Button text="Signup" onClick={() => navigate("/signup")} />
      </ButtonGroup>
    </NavbarContainer>
  );
};

export default Navbar;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Brand = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #0056b3;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: color 0.2s ease;
  position: relative;
  
  &:hover {
    color: #007bff;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #007bff;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;