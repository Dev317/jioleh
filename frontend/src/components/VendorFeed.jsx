import React, { useState } from "react";
import { useEffect } from "react";
import { client } from "../client";
import VendorMasonryLayout from "./VendorMasonryLayout";
import Spinner from "./Spinner";
import {
  searchByVendor,
} from "../utils/data";

const VendorFeed = ({ vendorId }) => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState();

  // query for pins
  // useEffect(() => {
  //   const query = vendorQuery(vendorId);
  //   client.fetch(query).then((data) => {
  //     setVendor(data[0]);
  //   });
  // }, [vendorId]);

  // load pins
  useEffect(() => {
    setLoading(true);
    const vendorQuery = searchByVendor(vendorId);
    client.fetch(vendorQuery).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }, [vendorId]);

  if (loading) return <Spinner message="Adding media to your feed!" />;

  if (!pins?.length) return <h2>No FoodSteps available</h2>;

  return <div>{pins && <VendorMasonryLayout pins={pins} />}</div>;
};

export default VendorFeed;
