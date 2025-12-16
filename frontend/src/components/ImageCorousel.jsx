import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const ImageCarousel = ({ images = [] }) => {
  const [index, setIndex] = useState(0);
  const validImages =
    images.length > 0 ? images : ["/placeholder.jpg"];

  const next = () =>
    setIndex((i) => (i + 1) % validImages.length);

  const prev = () =>
    setIndex((i) =>
      i === 0 ? validImages.length - 1 : i - 1
    );

  return (
    <Wrapper>
      <AnimatePresence mode="wait">
        <Slide
          key={index}
          src={validImages[index]}
          alt="product"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          draggable={false}
        />
      </AnimatePresence>

      {validImages.length > 1 && (
        <>
          <Arrow left onClick={prev}>‹</Arrow>
          <Arrow onClick={next}>›</Arrow>

          <Dots>
            {validImages.map((_, i) => (
              <Dot
                key={i}
                active={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </Dots>
        </>
      )}
    </Wrapper>
  );
};

export default ImageCarousel;

/* ---------------- STYLES ---------------- */

const Wrapper = styled.div`
  position: relative;
  height: 360px;
  background: #eef1ff;
`;

const Slide = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: auto;
  backface-visibility: hidden;
  transform: translateZ(0);
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ left }) => (left ? "left: 14px" : "right: 14px")};
  transform: translateY(-50%);
  z-index: 20;

  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;

  background: rgba(102, 126, 234, 0.9);
  color: white;
  font-size: 28px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.45);
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    transform: translateY(-50%) scale(1.1);
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  background: ${({ active }) =>
    active ? "#667eea" : "rgba(255,255,255,0.6)"};
`;
