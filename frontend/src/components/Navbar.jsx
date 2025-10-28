import React, { useContext, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NavbarContainer>
      <NavbarContent>
        <Brand onClick={() => navigate("/")}>
          <BrandIcon>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="url(#gradient)" strokeWidth="2"/>
              <path d="M12 6 L16 12 L12 18 L8 12 Z" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </BrandIcon>
          <BrandText>LocalLens</BrandText>
        </Brand>

        <NavList className={mobileMenuOpen ? "open" : ""}>
          <NavItem onClick={() => { navigate("/"); setMobileMenuOpen(false); }}>
            Home
          </NavItem>
          <NavItem onClick={() => { navigate("/complaints"); setMobileMenuOpen(false); }}>
            Complaints
          </NavItem>
          <NavItem onClick={() => { navigate("/marketplace"); setMobileMenuOpen(false); }}>
            Marketplace
          </NavItem>
          <NavItem onClick={() => { navigate("/concerns"); setMobileMenuOpen(false); }}>
            Concerns
          </NavItem>
          {user && (
            <NavItem onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}>
              Profile
            </NavItem>
          )}
        </NavList>

        <ButtonGroup>
          {!user ? (
            <>
              <LoginButton onClick={() => navigate("/login")}>
                Sign In
              </LoginButton>
            </>
          ) : (
            <>
              <Button text="Logout" onClick={logout} />
            </>
          )}
        </ButtonGroup>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;

const NavbarContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
`;

const NavbarContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 80px;

  @media (max-width: 968px) {
    padding: 16px 20px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BrandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandText = styled.div`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;

  @media (max-width: 968px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    gap: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-120%);
    transition: transform 0.3s ease;

    &.open {
      transform: translateY(0);
    }
  }
`;

const NavItem = styled.li`
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  transition: all 0.2s ease;
  position: relative;
  padding: 8px 0;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 968px) {
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &::after {
      display: none;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

const LoginButton = styled.button`
  padding: 10px 24px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;


const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  span {
    width: 25px;
    height: 3px;
    background: #667eea;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  @media (max-width: 968px) {
    display: flex;
  }
`;