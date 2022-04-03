import React, { useState, useEffect } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery, vendorSearchQuery } from "../utils/data";
import Spinner from "./Spinner";
import Carousel from "./Carousel";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (searchTerm !== "") {
      const vendorQuery = vendorSearchQuery(searchTerm.toLowerCase());
      const pinQuery = searchQuery(searchTerm.toLowerCase());
      Promise.all([client.fetch(pinQuery), client.fetch(vendorQuery)]).then(
        (data) => {
          setPins(data[0]);
          setVendors(data[1]);
          setLoading(false);
        }
      );
    } else {
      setVendors([]);
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      <h1 className="font-bold pl-2 pb-3">Discover</h1>
      {loading && <Spinner message="Searching pins" />}
      <div className="py-2">
        <h2 className="text-gray-500 pl-2 my-3">Eateries</h2>
        <Carousel data={vendors} />
      </div>
      <div className="py-2">
        <h2 className="text-gray-500 pl-2 my-3">Foodsteps</h2>
        {pins?.length !== 0 && <MasonryLayout pins={pins} />}
        {pins?.length === 0 && searchTerm !== "" && !loading && (
          <div className="mt-10 text-center text-xl ">No Pins Found!</div>
        )}
      </div>
    </div>
  );
};

export default Search;
