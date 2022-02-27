export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "userName",
      title: "UserName",
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
  ],
};
