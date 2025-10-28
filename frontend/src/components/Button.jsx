import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px 32px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #2177d3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    /* transform: translateY(-1px); */
  }

  &:active {
    background-color: #2f8fef;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 3px solid #80bdff;
    outline-offset: 2px;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function Button({ text, onClick, disabled = false, loading = false, type = "button" }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled || loading} type={type}>
      {loading ? <Spinner /> : text}
    </StyledButton>
  );
}

export default Button;
