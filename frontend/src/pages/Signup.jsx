














import React, { useState } from "react";
import axios from "axios";
import FilledButton from "../components/FilledButton";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null); // single source of truth
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setAlert({
        type: "error",
        message: "Please fill all fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        formData
      );
      console.log("Response:", res.data);
      setFormData({ name: "", email: "", password: "" });
      setAlert({
        type: "success",
        message: "Signup successful! Redirecting to login...",
        redirectTo: "/login",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Signup failed. Please try again later.",
      });
      console.error("Signup Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <SignupContainer>
          <FormCard>
            <Title>Create Account</Title>
            <Subtitle>Join us today and get started</Subtitle>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter your name"
                />
              </InputGroup>

              <InputGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                />
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Create a password"
                />
              </InputGroup>

              <FilledButton text="Sign Up" type="submit" loading={loading} />
            </Form>

            <SigninLink>
              Already have an account? <a href="/login">Sign In</a>
            </SigninLink>
          </FormCard>
        </SignupContainer>
      </PageWrapper>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          redirectTo={alert.redirectTo}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default Signup;

// Styled components same as yours below ↓
const PageWrapper = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SignupContainer = styled.div`
  width: 100%;
  max-width: 450px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
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

const SigninLink = styled.p`
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
