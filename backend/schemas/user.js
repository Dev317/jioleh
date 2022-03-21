export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "username",
      title: "Username",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "string",
    },
    {
      title: "VisitedPlacesID",
      name: "visitedPlacesId",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "walletAddress",
      title: "Wallet Address",
      type: "string"
    }
  ],
};
