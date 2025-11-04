import React from "react";
import styled, { keyframes, css } from "styled-components";

// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled button with variants
const Button = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  min-width: 110px;

  ${({ variant }) =>
    variant === "outline"
      ? css`
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;

          &:hover {
            background: #667eea;
            color: white;
          }
        `
      : css`
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;

          &:hover {
            opacity: 0.9;
          }
        `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

// Spinner element
const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 0.8s linear infinite;

  ${({ variant }) =>
    variant === "outline" &&
    css`
      border: 3px solid rgba(102, 126, 234, 0.4);
      border-top: 3px solid #667eea;
    `}
`;

// ✅ Enhanced Button that supports text prop
const BorderButton = ({
  text,
  children,
  loading = false,
  variant = "outline",
  loadingText = "Loading...",
  ...rest
}) => {
  const displayText = text || children;

  return (
    <Button variant={variant} disabled={loading} {...rest}>
      {loading ? (
        <>
          <Spinner variant={variant} />
          <span>{loadingText}</span>
        </>
      ) : (
        displayText
      )}
    </Button>
  );
};

export default BorderButton;
