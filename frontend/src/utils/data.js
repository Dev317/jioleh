export const categories = [
  {
    name: "Cafe",
    image:
      "https://www.escoffieronline.com/wp-content/uploads/2013/12/a-guide-to-latte-art-_1107_524867_1_14094340_500.jpg",
  },
  {
    name: "Restaurant",
    image:
      "https://i.pinimg.com/564x/d2/6b/71/d26b71d4bcb1609f11d7c5f7440792f6.jpg",
  },
  {
    name: "Brunch",
    image:
      "https://cdn.i-scmp.com/sites/default/files/d8/images/methode/2019/11/13/f36323f0-0440-11ea-a68f-66ebddf9f136_image_hires_151131.jpg",
  },
  {
    name: "Pet-Friendly",
    image:
        "https://mymodernmet.com/wp/wp-content/uploads/2020/10/cooper-baby-corgi-dogs-8.jpg",
  },
  {
    name: "Teatime",
    image:
        "https://static.onecms.io/wp-content/uploads/sites/44/2018/08/20/5677706.jpg",
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
