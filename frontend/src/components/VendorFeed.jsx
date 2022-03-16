import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQuery, vendorQuery, searchByVendor } from '../utils/data';
import { fetchVendor } from '../utils/fetchVendor';

const VendorFeed = () => {
  const [vendor, setVendor] = useState(null);
  const vendorId  = fetchVendor()._id;
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState();

  // query for pins
  useEffect(() => {
    const query = vendorQuery(vendorId);
    console.log(vendorId);
    client.fetch(query).then((data) => {
      setVendor(data[0]);
    });
  }, [vendorId]);

  // load pins
  useEffect(() => {
      setLoading(true);

      const vendorQuery = searchByVendor(vendorId);
      console.log("querying for pins of vendor");
      client.fetch(vendorQuery)
        .then((data) => {
          console.log(data);
          setPins(data);
          setLoading(false);
        });

  }, [vendorId]);

  if (loading) return <Spinner message='Adding media to your feed!'/>

  if(!pins?.length) return <h2>No pins available</h2>

  return (
      <div>
          {pins && (<MasonryLayout pins={pins}/>)}
      </div>
  );
};

export default VendorFeed;
