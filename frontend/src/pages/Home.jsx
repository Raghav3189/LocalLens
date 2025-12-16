import React, { useContext, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

/* ---------------- DATA ---------------- */

const features = [
  {
    icon: "🚧",
    title: "Post Complaints",
    desc: "Report issues in your area and help bring real change.",
    color: "#ef4444",
  },
  {
    icon: "🛒",
    title: "Buy & Sell",
    desc: "Support your local economy by trading nearby.",
    color: "#22c55e",
  },
  {
    icon: "💬",
    title: "Raise Concerns",
    desc: "Discuss ideas and shape your community together.",
    color: "#3b82f6",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "5K+", label: "Issues Solved" },
  { value: "15K+", label: "Items Traded" },
  { value: "50+", label: "Communities" },
];

/* ---------------- ANIMATIONS ---------------- */

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const float = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

/* ---------------- COMPONENT ---------------- */

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const goSignup = useCallback(() => navigate("/signup"), [navigate]);
  const goLogin = useCallback(() => navigate("/login"), [navigate]);

  return (
    <>
      <Navbar />

      {/* ---------------- HERO ---------------- */}
      <HeroSection>
        <HeroContent
          as={motion.div}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroTitle variants={item}>
            Your Community, <span>Your Voice</span>
          </HeroTitle>

          <HeroSubtitle variants={item}>
            Connect with your neighborhood. Post complaints, buy and sell
            locally, and raise concerns that matter.
          </HeroSubtitle>

          <HeroButtons variants={item}>
            {!user ? (
              <>
                <PrimaryButton onClick={goSignup}>
                  Get Started
                </PrimaryButton>
                <SecondaryButton onClick={goLogin}>
                  Sign In
                </SecondaryButton>
              </>
            ) : (
              <WelcomeText>Welcome back, {user.name} 👋</WelcomeText>
            )}
          </HeroButtons>
        </HeroContent>

        <HeroImage>
          <AnimatedSVG>
            <svg viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="150" fill="#fff" opacity="0.12" />
              <circle cx="200" cy="200" r="100" fill="#fff" opacity="0.18" />
              <path
                d="M200 120 L280 200 L200 280 L120 200 Z"
                fill="#fff"
                opacity="0.9"
              />
              <circle cx="200" cy="200" r="34" fill="white" />
            </svg>
          </AnimatedSVG>
        </HeroImage>
      </HeroSection>

      {/* ---------------- FEATURES ---------------- */}
      <FeaturesSection>
        <SectionTitle>What You Can Do</SectionTitle>

        <FeaturesGrid>
          {features.map((f) => (
            <FeatureCard
              as={motion.div}
              whileHover={{ y: -8 }}
              key={f.title}
            >
              <IconWrapper color={f.color}>{f.icon}</IconWrapper>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDescription>{f.desc}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* ---------------- STATS ---------------- */}
      <StatsSection>
        <StatsGrid>
          {stats.map((s) => (
            <StatCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={s.label}
            >
              <StatNumber>{s.value}</StatNumber>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      {/* ---------------- CTA ---------------- */}
      <CTASection>
        <CTAContainer
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <CTATitle>Ready to Make a Difference?</CTATitle>
          <CTADescription>
            Be part of your neighborhood’s growth — share, connect, and take
            action with LocalLens.
          </CTADescription>
          <CTAButton onClick={() => navigate(user ? "/" : "/signup")}>
            {user ? "Explore Now" : "Join LocalLens"}
          </CTAButton>
        </CTAContainer>
      </CTASection>

      {/* ---------------- FOOTER ---------------- */}
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

export default React.memo(Home);

/* ---------------- STYLES ---------------- */

const HeroSection = styled.section`
  min-height: calc(100vh - 90px);
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 80px;
  gap: 60px;

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 560px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 56px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 20px;

  span {
    background: linear-gradient(120deg, #ffd89b, #19547b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 36px;
`;

const HeroButtons = styled(motion.div)`
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
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: white;
  border: 2px solid white;
`;

const WelcomeText = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const HeroImage = styled.div`
  display: flex;
  justify-content: center;
`;

const AnimatedSVG = styled.div`
  width: 360px;
  animation: ${float} 5s ease-in-out infinite;
`;

const FeaturesSection = styled.section`
  padding: 80px;
  background: #f8f9fa;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 40px;
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
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: ${(p) => `${p.color}22`};
  color: ${(p) => p.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: #555;
`;

const StatsSection = styled.section`
  padding: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  padding: 100px 20px;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
`;

const CTAContainer = styled.div`
  background: white;
  padding: 80px 60px;
  border-radius: 20px;
  text-align: center;
  max-width: 800px;
`;

const CTATitle = styled.h2`
  font-size: 38px;
  margin-bottom: 20px;
`;

const CTADescription = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
`;

const CTAButton = styled.button`
  padding: 16px 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const Footer = styled.footer`
  background: #0f0f0f;
  padding: 60px 20px;
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
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;

  &:hover {
    color: white;
  }
`;

const FooterCopyright = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;
