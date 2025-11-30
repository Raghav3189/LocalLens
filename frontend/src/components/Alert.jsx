import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

const colorThemes = {
  success: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  error: { bg: "#fef2f2", border: "#ef4444", text: "#7f1d1d" },
  info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a" },
  warning: { bg: "#fff7ed", border: "#f97316", text: "#78350f" },
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 9999;
`;

const AlertBox = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.bg};
    color: ${theme.text};
    border: 2px solid ${theme.border};
  `}
  border-radius: 18px;
  padding: 28px 34px;
  text-align: center;
  min-width: 320px;
  max-width: 420px;
  animation: ${slideUp} 0.35s ease-out;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
  ${({ type }) =>
    (type === "success" || type === "info") &&
    css`
      animation: ${pulse} 2.2s infinite ease-in-out;
    `}
`;

const AlertTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const AlertMessage = styled.p`
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 22px;
`;

const Button = styled.button`
  ${({ theme }) => css`
    background: ${theme.border};
  `}
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.25s ease;
  &:hover {
    transform: scale(1.05);
    opacity: 0.95;
  }
`;

const Alert = ({
  type = "info",
  message,
  onClose,
  redirectTo,
  dismissOnClickOutside = false,
}) => {
  const navigate = useNavigate();
  const theme = colorThemes[type] || colorThemes.info;

  const handleOk = () => {
    onClose?.();
    if (redirectTo) navigate(redirectTo);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") handleOk();
  };

  const icons = {
    success: <CheckCircle2 size={42} color={theme.border} />,
    error: <AlertCircle size={42} color={theme.border} />,
    info: <Info size={42} color={theme.border} />,
    warning: <AlertTriangle size={42} color={theme.border} />,
  };

  return (
    <Overlay
      onClick={() => {
        if (dismissOnClickOutside) handleOk();
      }}
    >
      <AlertBox
        role="alertdialog"
        aria-live="assertive"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        theme={theme}
      >
        <IconWrapper type={type}>{icons[type]}</IconWrapper>
        <AlertTitle>{type.charAt(0).toUpperCase() + type.slice(1)}</AlertTitle>
        <AlertMessage>{message}</AlertMessage>
        <Button onClick={handleOk} theme={theme}>
          OK
        </Button>
      </AlertBox>
    </Overlay>
  );
};

export default Alert;
