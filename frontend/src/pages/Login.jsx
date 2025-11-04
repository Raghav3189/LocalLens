import React, { useState } from "react";
import styled from "styled-components";
import FilledButton from "../components/FilledButton";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      login(res.data.user, res.data.token);

      setMessage("Login Successful");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Login failed");
      } else {
        setMessage("Server not reachable");
      }
      console.error("Login Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <LoginContainer>
          <FormCard>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to continue to your account</Subtitle>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </InputGroup>

              <ForgotPassword href="/forgot-password">
                Forgot password?
              </ForgotPassword>

              <FilledButton type="submit" text="Sign In" loading={loading} />
            </Form>

            {message && (
              <Message success={message.includes("Successful")}>
                {message}
              </Message>
            )}

            <SignupLink>
              Don't have an account? <a href="/signup">Sign Up</a>
            </SignupLink>
          </FormCard>
        </LoginContainer>
      </PageWrapper>
    </>
  );
};

export default Login;


const PageWrapper = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 32px 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const ForgotPassword = styled.a`
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  text-align: right;
  font-weight: 500;
  margin-top: -8px;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  background-color: ${(props) =>
    props.success ? "#d4edda" : "#f8d7da"};
  color: ${(props) => (props.success ? "#155724" : "#721c24")};
  border: 1px solid
    ${(props) => (props.success ? "#c3e6cb" : "#f5c6cb")};
`;

const SignupLink = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;
