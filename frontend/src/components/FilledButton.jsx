import React from "react";
import styled, { keyframes, css } from "styled-components";

// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled filled button
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
  color: white;

  /* 🔹 Perfect gradient & text color */
  background-color: #667eea;
  border: 2px solid transparent;

  &:hover {
    filter: brightness(1.1);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    `}
`;

// Spinner (white for filled)
const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 0.8s linear infinite;
`;

// ✅ FilledButton component
const FilledButton = ({
  text,
  children,
  loading = false,
  loadingText = "Loading...",
  ...rest
}) => {
  const displayText = text || children;

  return (
    <Button disabled={loading} {...rest}>
      {loading ? (
        <>
          <Spinner />
          <span>{loadingText}</span>
        </>
      ) : (
        displayText
      )}
    </Button>
  );
};

export default FilledButton;
