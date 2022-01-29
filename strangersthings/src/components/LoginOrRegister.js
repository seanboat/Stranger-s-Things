import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import { FormContainer } from "../layout/FormContainer";
import { setTokenOnLocalStorage } from "../util";

export default function LoginOrRegister({ setToken, setIsLoggedIn }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const loginOrRegisterPath = pathname.slice(1);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const formFields = [
    { id: 1, type: "text", name: "username", value: form.username },
    { id: 2, type: "password", name: "password", value: form.password },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/${loginOrRegisterPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: form,
        }),
      });

      const { data } = await response.json();

      setTokenOnLocalStorage(data.token);
      setToken(data.token);
      setIsLoggedIn(true);

      history.push("./home");
    } catch (error) {
      setIsLoggedIn(false);
      setToken(null);

      console.error(error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {formFields.map(({ id, type, name, value }) => (
        <div key={id}>
          <label htmlFor={name}>{`${
            loginOrRegisterPath === "register" ? "Choose" : "Enter "
          }${name}`}</label>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
          />
        </div>
      ))}
      <input
        type="submit"
        value={loginOrRegisterPath === "register" ? "sign me up" : "log in"}
      />
    </FormContainer>
  );
}
