import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
            {!user ? (
              <>
                <PrimaryButton onClick={() => navigate("/signup")}>
                  Get Started
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate("/login")}>
                  Sign In
                </SecondaryButton>
              </>
            ) : (
              <HeroSubtitle>Welcome back, {user.name} 👋</HeroSubtitle>
            )}
          </HeroButtons>
        </HeroContent>

        <HeroImage>
          <AnimatedSVG>
            <svg viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="150" fill="#667eea" opacity="0.12" />
              <circle cx="200" cy="200" r="100" fill="#764ba2" opacity="0.18" />
              <path d="M200 120 L280 200 L200 280 L120 200 Z" fill="#6b6be8" opacity="0.9" />
              <circle cx="200" cy="200" r="34" fill="white" opacity="0.95" />
            </svg>
          </AnimatedSVG>
        </HeroImage>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>What You Can Do</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <IconWrapper color="#ef4444">🚧</IconWrapper>
            <FeatureTitle>Post Complaints</FeatureTitle>
            <FeatureDescription>
              Report issues in your area — from potholes to streetlights — and bring change.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper color="#22c55e">🛒</IconWrapper>
            <FeatureTitle>Buy & Sell</FeatureTitle>
            <FeatureDescription>
              Support your local economy by buying and selling with people nearby.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <IconWrapper color="#3b82f6">💬</IconWrapper>
            <FeatureTitle>Raise Concerns</FeatureTitle>
            <FeatureDescription>
              Start discussions, share ideas, and take part in shaping your community.
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
            <StatLabel>Issues Solved</StatLabel>
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
        <CTAContainer>
          <CTATitle>Ready to Make a Difference?</CTATitle>
          <CTADescription>
            Be part of your neighborhood’s growth — share, connect, and take action with LocalLens.
          </CTADescription>
          <CTAButton onClick={() => navigate(user ? "/" : "/signup")}>
            {user ? "Explore Now" : "Join LocalLens"}
          </CTAButton>
        </CTAContainer>
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

/* --- STYLED COMPONENTS --- */

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 90px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 80px 40px;
  gap: 60px;

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 550px;
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  line-height: 1.2;

  span {
    background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: white;
  color: #667eea;
  padding: 14px 36px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.25);

  &:hover {
    transform: scale(1.05);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  border: 2px solid white;
  color: white;

  &:hover {
    background: white;
    color: #667eea;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimatedSVG = styled.div`
  width: 380px;
  height: 380px;
  animation: ${float} 5s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 80px;
  background: #f8f9fa;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 60px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${(p) => `${p.color}22`};
  color: ${(p) => p.color};
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 60px;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
`;

const StatCard = styled.div``;
const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
`;
const StatLabel = styled.div`
  font-size: 18px;
  opacity: 0.9;
`;

const CTASection = styled.section`
  background: #f3f4f6;
  padding: 100px 60px;
  display: flex;
  justify-content: center;
`;

const CTAContainer = styled.div`
  background: white;
  padding: 80px 60px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const CTATitle = styled.h2`
  font-size: 38px;
  color: #1a1a1a;
  margin-bottom: 20px;
`;

const CTADescription = styled.p`
  font-size: 18px;
  color: #444;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 16px 48px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
`;

const Footer = styled.footer`
  background: #0f0f0f;
  padding: 60px 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const FooterBrand = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 700;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    &:hover {
      color: white;
    }
  }
`;

const FooterCopyright = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;
const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.25s ease;

  &:hover {
    color: white;
  }
`;