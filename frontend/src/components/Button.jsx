import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    // transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  &:focus-visible {
    outline: 3px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;

    &::before {
      display: none;
    }
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  position: relative;
  z-index: 1;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function Button({ text, onClick, disabled = false, loading = false, type = "button" }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled || loading} type={type}>
      {loading ? (
        <>
          <Spinner />
          <span>{text}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </StyledButton>
  );
}

export default Button;