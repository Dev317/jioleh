import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQuery, vendorSearchQuery,vendorDefaultQuery } from '../utils/data';
import Carousel from "./Carousel";

const Feed = () => {

  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [pins, setPins] = useState();

  const { categoryId } = useParams();

  useEffect(() => {
      setLoading(true);

      if (categoryId) {
          const vendorQuery = vendorSearchQuery(categoryId);
          const pinQuery = searchQuery(categoryId);
          Promise.all([client.fetch(pinQuery), client.fetch(vendorQuery)]).then(
              (data) => {
                  setPins(data[0]);
                  setVendors(data[1]);
                  setLoading(false);
              }
          );
      } else {
          const vendorQuery = vendorSearchQuery("");
          Promise.all([client.fetch(feedQuery), client.fetch(vendorDefaultQuery)]).then(
              (data) => {
                  setPins(data[0]);
                  setVendors(data[1]);
                  setLoading(false);
              }
          );
      }
  }, [categoryId]);

  if (loading) return <Spinner message='Adding media to your feed!'/>

  if(!pins?.length) return <h2>No pins available</h2>

    if(categoryId) {

return (
    <div>
        <h1 className="font-bold pl-2 pb-3">
            {categoryId ? categoryId : "Foodsteps around you"}
        </h1>
        <div className="py-2">
            <h2 className="text-gray-500 pl-2 my-3">Eateries</h2>
            <Carousel data={vendors} />
        </div>
        <div className="py-2">
            <h2 className="text-gray-500 pl-2 my-3">Foodsteps</h2>

            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && categoryId !== "" && !loading && (
                <div className="mt-10 text-center text-xl ">No Pins Found!</div>
            )}
        </div>
    </div>
);} else {
        return (
            <div>
                <div className="py-2">
                    <h2 className="text-gray-500 pl-2 my-3">Eateries around you</h2>
                    <Carousel data={vendors} />
                </div>
        <div className="py-2">
            <h2 className="text-gray-500 pl-2 my-3">Foodsteps around you</h2>

            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && categoryId !== "" && !loading && (
                <div className="mt-10 text-center text-xl ">No Pins Found!</div>
            )}
        </div>
            </div>
        );
    }
};

export default Feed;
