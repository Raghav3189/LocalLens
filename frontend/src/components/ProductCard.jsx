import React, { memo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ProductCard = ({ product, onClick }) => {
  const image = product?.images?.[0] || "/placeholder.jpg";

  return (
    <Card
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
    >
      <ImageContainer>
        <Image
          src={image}
          alt={product.name}
          loading="lazy"
        />

        <TypeBadge>
          {product.type === "sell" ? "For Sale" : "For Rent"}
        </TypeBadge>
      </ImageContainer>

      <Content>
        <Name title={product.name}>{product.name}</Name>

        <Price>
          ₹{product.price.toLocaleString()}
          {product.priceUnit === "per_day" && <Unit>/day</Unit>}
        </Price>

        <Distance>
          {product.distance.toFixed(1)} km away
        </Distance>
      </Content>
    </Card>
  );
};

export default memo(ProductCard);

/* ---------------- STYLES ---------------- */

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 18px 45px rgba(102, 126, 234, 0.25);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  background: #eef1ff;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: auto;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const TypeBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: #667eea;

  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.45);
`;

const Content = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  font-size: 21px;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Unit = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
`;

const Distance = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;
