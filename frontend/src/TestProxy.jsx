import React, { useEffect, useState } from "react";
import axios from "axios";

function TestProxy() {
  const [message, setMessage] = useState("");
  const [postResponse, setPostResponse] = useState("");

  const postData = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/send-data", {
        name: "Raghav",
        age: 23,
      });
      setPostResponse(res.data.message);
    } catch (err) {
      console.error("POST Error:", err);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/test");
      setMessage(res.data.message);
    } catch (err) {
      console.error("GET Error:", err);
    }
  };

  useEffect(() => {
    postData();
    getData();
  }, []);

  return (
    <div>
      <h2>Proxy Test:</h2>
      <p>{message}</p>
      <h2>Post Request Response:</h2>
      <p>{postResponse}</p>
    </div>
  );
}

export default TestProxy;
