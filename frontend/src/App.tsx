import React from "react";
import logo from "./logo.svg";
import "./App.css";

const App: React.FC = () => {
  const data: any = [];
  const loading = true;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      {data.posts.map((post: any) => (
        <div>
          <h1>A new Post by {post.auhtor.username}</h1>
          <p>{post.content}</p>
          <b>{post.likes.length} likes</b>
        </div>
      ))}
    </div>
  );
};

export default App;
