import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BorderButton from "./BorderButton";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NavbarContainer>
      <NavbarContent>
        {/* Brand */}
        <Brand onClick={() => navigate("/")}>
          <BrandIcon>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="url(#gradient)"
                strokeWidth="2"
              />
              <path d="M12 6 L16 12 L12 18 L8 12 Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </BrandIcon>
          <BrandText>LocalLens</BrandText>
        </Brand>

        {/* Navigation Links */}
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

          {/* ✅ Mobile Sign In / Logout button */}
          <MobileButtonContainer>
            {!user ? (
              <BorderButton
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </BorderButton>
            ) : (
              <BorderButton
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </BorderButton>
            )}
          </MobileButtonContainer>
        </NavList>

        {/* Desktop Buttons */}
        <ButtonGroup>
          {!user ? (
            <BorderButton onClick={() => navigate("/login")}>Sign In</BorderButton>
          ) : (
            <BorderButton onClick={logout}>Logout</BorderButton>
          )}
        </ButtonGroup>

        {/* Mobile Menu Button */}
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

/* ------------------- Styled Components ------------------- */

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

const MobileButtonContainer = styled.div`
  display: none;

  @media (max-width: 968px) {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
      width: 100%;
      justify-content: center;
    }
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
