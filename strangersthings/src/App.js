import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getTokenFromLocalStorage } from "./util";
import { API_URL } from "./config";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState({});

  useEffect(() => {
    const token = getTokenFromLocalStorage();

    if (token) {
      setIsLoggedIn(true);
      setToken(token);
    }

    const getPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = await response.json();

        setPosts(data.posts.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    getPosts();
  }, [me]);

  const [meFlag, setMeFlag] = useState(false);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const { data: me } = await response.json();

        setMe(me);
      } catch (error) {
        console.error(error);
      }
    };
  });

  const updateMe = () => {
    setMeFlag(!meFlag);
  };

  return (
    <Router>
      <main>
        <Nav
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setMe={setMe}
        />
        <Route
          exact
          path={"/"}
          render={() => (
            <Posts posts={posts} setPosts={setPosts} isLoggedIn={isLoggedIn} />
          )}
        />
        <Route
          exact
          path={"/home"}
          render={() => (
            <Posts posts={posts} setPosts={setPosts} isLoggedIn={isLoggedIn} />
          )}
        />
        {!isLoggedIn && (
          <Switch>
            <Route
              exact
              path={"/login"}
              render={() => (
                <LogInOrRegister
                  setToken={setToken}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
            />
            <Route
              exact
              path={"/register"}
              render={() => (
                <LogInOrRegister
                  setToken={setToken}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
            />
          </Switch>
        )}
        {isLoggedIn && (
          <Switch>
            <Route
              exact
              path={"/posts/new"}
              render={() => (
                <CreatePost
                  posts={posts}
                  setPosts={setPosts}
                  updateMe={updateMe}
                />
              )}
            />
            <Route
              exact
              path={"/posts/:postId/messages/new"}
              render={() => <CreateMessage token={token} />}
            />
            <Route
              exact
              path={"users/me"}
              render={() => <Me me={me} updateMe={updateMe} token={token} />}
            />
          </Switch>
        )}
      </main>
    </Router>
  );
}
