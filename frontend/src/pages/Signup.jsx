import React, { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Signup = () =>{

    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:''
    });

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(formData);
    }

    return(
        <>
            <Navbar/>
            <SignupContainer>
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    <div>
                        <label>email:</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <Button text="Signup"/>
                </form>
            </SignupContainer>
        </>
    );
}

export default Signup;

const SignupContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-around;
`;