export const categories = [
  {
    name: "Cafe",
    image:
      "https://i.pinimg.com/564x/67/cd/c1/67cdc1683f91f9916de003ca3c94ef57.jpg",
  },
  {
    name: "Restaurant",
    image:
      "https://i.pinimg.com/564x/d2/6b/71/d26b71d4bcb1609f11d7c5f7440792f6.jpg",
  },
  {
    name: "FoodStalls",
    image:
      "https://i.pinimg.com/564x/87/12/d5/8712d56c722be25ad2496c99934624d8.jpg",
  },
];

export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

export const vendorQuery = (vendorId) => {
  const query = `*[_type == "vendor" && _id == '${vendorId}']`;
  return query;
};

//for finding vendors in a separate carousell
export const vendorSearchQuery = (searchTerm) => {
  const query = `*[_type == "vendor" && username match '${searchTerm}*' || name match '${searchTerm}*']{
        _id,
        username,
        name,
        category,
        location
    }`;
  return query;
};

export const vendorDefaultQuery = `*[_type == "vendor" ]{
        _id,
        username,
        name,
        category,
        location,
        image {
            asset -> {
                url
            }
        },
        bgimage {
            asset -> {
                url
            }
        }
    }`;

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && (title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*')]{
        image {
            asset -> {
                url
            }
        },
        video {
          asset -> {
              ...,
              "url" : "https://stream.mux.com/" + playbackId
          }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        save[] {
            _key,
            postedBy -> {
                _id,
                username,
                image
            },
        },
    }`;
  return query;
};

export const searchByVendor = (searchTerm) => {
  const query = `*[_type == "pin" && taggedVendor == '${searchTerm}' ]{
        image {
            asset -> {
                url
            }
        },
        video {
          asset -> {
              ...,
              "url" : "https://stream.mux.com/" + playbackId
          }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        save[] {
            _key,
            postedBy -> {
                _id,
                username,
                image
            },
        },
    }`;
  return query;
};


export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    image {
      asset -> {
        url
      }
    },
    video {
        asset -> {
            ...,
            "url" : "https://stream.mux.com/" + playbackId
        }
    },
    _id,
    destination,
    postedBy -> {
        _id,
        username,
        image
    },
    save[]{
        _key,
        postedBy -> {
            _id,
            username,
            image
          },
        },
    } `;

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
          image{
            asset->{
              url
            }
          },
          video {
            asset -> {
                ...,
                "url" : "https://stream.mux.com/" + playbackId
            }
          },
          _id,
          title, 
          about,
          category,
          taggedVendor,
          destination,
          postedBy->{
            _id,
            username,
            image
          },
         save[]{
            postedBy->{
              _id,
              username,
              image
            },
          },
          comments[]{
            comment,
            _key,
            postedBy->{
              _id,
              username,
              image
            },
          }
        }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
          image{
            asset->{
              url
            }
          },
          _id,
          destination,
          postedBy->{
            _id,
            userName,
            image
          },
          save[]{
            _key,
            postedBy->{
              _id,
              userName,
              image
            },
          },
        }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
          image{
            asset->{
              url
            }
          },
          _id,
          destination,
          postedBy->{
            _id,
            username,
            image
          },
          save[]{
            postedBy->{
              _id,
              username,
              image
            },
          },
        }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
          image{
            asset->{
              url
            }
          },
          _id,
          destination,
          postedBy->{
            _id,
            username,
            image
          },
          save[]{
            postedBy->{
              _id,
              username,
              image
            },
          },
        }`;
  return query;
};
