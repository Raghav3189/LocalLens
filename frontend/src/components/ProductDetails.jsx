import React, { memo, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import ImageCarousel from "../components/ImageCorousel";

const ProductDetails = ({ product, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <Overlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          as={motion.div}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>×</CloseButton>

          <ImageWrapper>
            <ImageCarousel images={product.images} />

            <TypeBadge>
              {product.type === "sell" ? "For Sale" : "For Rent"}
            </TypeBadge>
          </ImageWrapper>

          <Content>
            <Header>
              <Title>{product.name}</Title>
              <Price>
                ₹{product.price.toLocaleString()}
                {product.priceUnit === "per_day" && <Unit>/day</Unit>}
              </Price>
            </Header>

            <Meta>{product.distance.toFixed(1)} km away</Meta>

            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{product.description}</Description>
            </Section>

            <Section>
              <SectionTitle>Contact</SectionTitle>

              <ContactItem>
                <Label>Email</Label>
                <Value href={`mailto:${product.contactEmail}`}>
                  {product.contactEmail}
                </Value>
              </ContactItem>

              <ContactItem>
                <Label>Phone</Label>
                <Value href={`tel:${product.contactPhone}`}>
                  {product.contactPhone}
                </Value>
              </ContactItem>
            </Section>
          </Content>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default memo(ProductDetails);

/* ---------------- STYLES ---------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 16px;
`;

const Modal = styled.div`
  background: #fff;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  border-radius: 22px;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 30;

  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;

  background: #667eea;
  color: white;
  font-size: 28px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

//   box-shadow: 0 10px 25px rgba(102, 126, 234, 0.45);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: #5a6fe0;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
//background: #eef1ff;
  border-radius: 22px 22px 0 0;
  overflow: hidden;
`;

const TypeBadge = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: #667eea;
`;

const Content = styled.div`
  padding: 28px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
`;

const Price = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Unit = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const Meta = styled.div`
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 26px;
`;

const Section = styled.div`
  margin-bottom: 26px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #374151;
`;

const ContactItem = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
`;

const Label = styled.span`
  font-weight: 600;
  min-width: 70px;
`;

const Value = styled.a`
  color: #667eea;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
