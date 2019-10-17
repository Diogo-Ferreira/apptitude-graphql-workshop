import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_POSTS = gql`
  query {
    posts {
      content
      auhtor {
        username
      }
      likes {
        username
      }
    }
  }
`;

const App: React.FC = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  console.log(data, loading, error);

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
