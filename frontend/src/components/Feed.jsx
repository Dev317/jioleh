import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery, followingFeedQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState();
  const loggedInUser = fetchUser();

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client
        .getDocument(loggedInUser.googleId)
        .then((res) => {
          client
            .fetch(
              res.following && res.following.length > 0
                ? followingFeedQuery(res.following)
                : feedQuery
            )
            .then((data) => {
              console.log(data);
              setPins(data);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [categoryId, loggedInUser.googleId]);

  if (loading) return <Spinner message="Adding media to your feed!" />;

  if (!pins?.length) return <h2>No pins available</h2>;

  return (
    <div>
      <h1 className="font-bold pl-2 pb-3">
        {categoryId ? "Discover" : "Recommended for you"}
      </h1>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;
