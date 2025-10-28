import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: [e.target.value],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <Navbar />
      <LoginContainer>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={FormData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={FormData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" text="Login" />
        </form>
      </LoginContainer>
    </>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  jusify-content: space-between;
  flex-direction: column;
`;
