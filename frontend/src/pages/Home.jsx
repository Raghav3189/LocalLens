import React from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Your Community, <span>Your Voice</span>
          </HeroTitle>
          <HeroSubtitle>
            Connect with your neighborhood. Post complaints, buy and sell
            locally, and raise concerns that matter.
          </HeroSubtitle>
          <HeroButtons>
            {!user && (
              <>
                <PrimaryButton onClick={() => navigate("/signup")}>
                  Get Started
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate("/login")}>
                  Sign In
                </SecondaryButton>
              </>
            )}

            {user && <HeroSubtitle>Welcome back, {user.name} 👋</HeroSubtitle>}
          </HeroButtons>
        </HeroContent>
        <HeroImage>
          <ImagePlaceholder>
            <svg viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="150" fill="#667eea" opacity="0.1" />
              <circle cx="200" cy="200" r="100" fill="#764ba2" opacity="0.2" />
              <path d="M200 120 L280 200 L200 280 L120 200 Z" fill="#667eea" />
              <circle cx="200" cy="200" r="30" fill="white" />
            </svg>
          </ImagePlaceholder>
        </HeroImage>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>What You Can Do</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <IconWrapper color="#ff6b6b">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </IconWrapper>
            <FeatureTitle>Post Complaints</FeatureTitle>
            <FeatureDescription>
              Report issues in your community. From potholes to noise
              complaints, make your voice heard.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper color="#4ecdc4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </IconWrapper>
            <FeatureTitle>Buy & Sell</FeatureTitle>
            <FeatureDescription>
              Discover local marketplace. Buy from neighbors, sell items you
              don't need, support local business.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper color="#95e1d3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </IconWrapper>
            <FeatureTitle>Raise Concerns</FeatureTitle>
            <FeatureDescription>
              Start discussions about community matters. Get support, share
              ideas, and drive positive change.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>5K+</StatNumber>
            <StatLabel>Issues Resolved</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>15K+</StatNumber>
            <StatLabel>Items Traded</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>Communities</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <CTAContent>
          <CTATitle>Ready to Make a Difference?</CTATitle>
          <CTADescription>
            Join thousands of community members making their neighborhoods
            better, one post at a time.
          </CTADescription>
          <CTAButton onClick={() => navigate("/signup")}>
            Join LocalLens Today
          </CTAButton>
        </CTAContent>
      </CTASection>

      <Footer>
        <FooterContent>
          <FooterBrand>LocalLens</FooterBrand>
          <FooterLinks>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            © 2025 LocalLens. All rights reserved.
          </FooterCopyright>
        </FooterContent>
      </Footer>
    </>
  );
};

export default Home;

const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 80px;
  gap: 60px;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0 0 24px 0;
  line-height: 1.2;

  //   span {
  //     background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%);
  //     -webkit-background-clip: text;
  //     -webkit-text-fill-color: transparent;
  //     background-clip: text;
  //   }

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled.button`
  padding: 16px 40px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  padding: 16px 40px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagePlaceholder = styled.div`
  width: 400px;
  height: 400px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const FeaturesSection = styled.section`
  padding: 100px 80px;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 60px 0;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const StatsSection = styled.section`
  padding: 80px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const StatLabel = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const CTASection = styled.section`
  padding: 100px 80px;
  background: #1a1a1a;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: white;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const CTADescription = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 40px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CTAButton = styled.button`
  padding: 18px 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Footer = styled.footer`
  background: #0f0f0f;
  padding: 40px 80px;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const FooterBrand = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const FooterCopyright = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;
