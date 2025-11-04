import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "../components/Navbar";
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
            Your Community, <GradientText>Your Voice</GradientText>
          </HeroTitle>
          <HeroSubtitle>
            Connect, share, and shape your neighborhood. Report issues, trade locally, and raise your voice for positive change.
          </HeroSubtitle>
          <HeroButtons>
            {!user ? (
              <>
                <PrimaryButton onClick={() => navigate("/signup")}>Get Started</PrimaryButton>
                <SecondaryButton onClick={() => navigate("/login")}>Sign In</SecondaryButton>
              </>
            ) : (
              <Welcome>Welcome back, {user.name} 👋</Welcome>
            )}
          </HeroButtons>
        </HeroContent>

        <HeroImage>
          <LogoAnimation>
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="160" fill="url(#outer)" opacity="0.1" />
              <circle cx="200" cy="200" r="110" fill="url(#middle)" opacity="0.18" />
              <path d="M200 130 L270 200 L200 270 L130 200 Z" fill="url(#diamond)" opacity="0.85" />
              <circle cx="200" cy="200" r="36" fill="white" opacity="0.95" />
              <defs>
                <radialGradient id="outer" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#7f6eea" />
                  <stop offset="100%" stopColor="#4b2c7a" />
                </radialGradient>
                <radialGradient id="middle" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#8b6fc0" />
                </radialGradient>
                <linearGradient id="diamond" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7787ee" />
                  <stop offset="100%" stopColor="#8b6fc0" />
                </linearGradient>
              </defs>
            </svg>
            <GlowLayer />
          </LogoAnimation>
        </HeroImage>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>What You Can Do</SectionTitle>
        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard key={i}>
              <IconCircle color={f.color}>{f.icon}</IconCircle>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((s, i) => (
            <Stat key={i}>
              <StatNumber>{s.num}</StatNumber>
              <StatLabel>{s.label}</StatLabel>
            </Stat>
          ))}
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <CTABox>
          <CTATitle>Ready to Make a Difference?</CTATitle>
          <CTADesc>
            Be part of your neighborhood’s story — collaborate, act, and create positive change.
          </CTADesc>
          <CTAButton onClick={() => navigate(user ? "/" : "/signup")}>
            {user ? "Explore" : "Join LocalLens"}
          </CTAButton>
        </CTABox>
      </CTASection>

      <Footer>
        <FooterBrand>LocalLens</FooterBrand>
        <FooterLinks>
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </FooterLinks>
        <FooterCopy>© 2025 LocalLens. All rights reserved.</FooterCopy>
      </Footer>
    </>
  );
};

export default Home;

/* --- Animations --- */
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

/* --- Styled Components --- */
const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #7787ee 0%, #8b6fc0 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 80px 60px;
  gap: 60px;
  position: relative;

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 60px 20px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 550px;
`;

const HeroTitle = styled.h1`
  font-size: 58px;
  font-weight: 800;
  line-height: 1.2;
  color: white;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
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

const Welcome = styled.p`
  color: white;
  font-size: 18px;
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-40px);
`;

const LogoAnimation = styled.div`
  width: 340px;
  height: 340px;
  animation: ${pulse} 6s ease-in-out infinite;
  position: relative;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const GlowLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.18), transparent 70%);
  animation: ${glow} 7s ease-in-out infinite;
`;

const FeaturesSection = styled.section`
  padding: 100px 80px;
  background: #f8f9fa;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 60px;
  color: #1a1a1a;
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
  &:hover {
    transform: scale(1.05) translateY(-6px);
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.25);
  }
`;

const IconCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${(p) => `${p.color}22`};
  color: ${(p) => p.color};
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const FeatureDesc = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #8b6fc0 100%);
  padding: 100px 80px;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
`;

const Stat = styled.div``;

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
  padding: 120px 80px;
  display: flex;
  justify-content: center;
`;

const CTABox = styled.div`
  background: linear-gradient(135deg, #7787ee, #8b6fc0);
  color: white;
  border-radius: 20px;
  padding: 80px 60px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(118, 75, 162, 0.4);
`;

const CTATitle = styled.h2`
  font-size: 38px;
  margin-bottom: 20px;
`;

const CTADesc = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 25px rgba(255, 255, 255, 0.3);
  }
`;

const Footer = styled.footer`
  background: #0f0f0f;
  padding: 60px 20px;
  text-align: center;
`;

const FooterBrand = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    &:hover {
      color: white;
    }
  }
`;

const FooterCopy = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

/* --- Data --- */
const features = [
  { icon: "🚧", title: "Post Complaints", desc: "Report local issues — from potholes to streetlights.", color: "#ef4444" },
  { icon: "🛒", title: "Buy & Sell Locally", desc: "Trade items and support nearby residents and shops.", color: "#22c55e" },
  { icon: "💬", title: "Raise Concerns", desc: "Start discussions that create awareness and progress.", color: "#3b82f6" },
];

const stats = [
  { num: "10K+", label: "Active Users" },
  { num: "5K+", label: "Issues Solved" },
  { num: "15K+", label: "Items Traded" },
  { num: "50+", label: "Communities" },
];
