import React, { useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { API_URL } from "../config";

const CreateMessageContainer = styled.div`
  & {
    display: flex;
    flex-direcrtion: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 400px;
    margin: 0 auto;
  }
  & textarea {
    height: 100px;
    width: 400px;
    margin-top: 2px;
  }
  & form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  & input {
    margin: 20px 0;
    padding: 8px;
    width: 140px;
  }
`;

export default function CreateMessage({ token }) {
  const history = useHistory();
  const { search } = useLocation();
  const searchObj = new URLSearchParams(search);
  const { postId } = useParams();
  const title = searchObj.get("title");

  console.log(postId, title);

  const [content, setContent] = useState("");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: { content } }),
      });

      const { success } = await response.json();

      if (success) {
        history.push("./home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CreateMessageContainer>
      <h2>Message the seller</h2>
      <p>Title: {title}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"content"}>Message:</label>
        <textarea onChange={handleChange}></textarea>
        <input type="submit" value="send message" />
      </form>
    </CreateMessageContainer>
  );
}
