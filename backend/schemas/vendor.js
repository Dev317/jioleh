import client from "part:@sanity/base/client";

const isUniqueUsername = (username, context) => {
  const { document } = context;

  const id = document._id.replace(/^drafts\./, "");

  const params = {
    draft: `drafts.${id}`,
    published: id,
    username,
  };

  /* groq */
  const query = `!defined(*[
      _type == 'vendor' &&
      !(_id in [$draft, $published]) &&
      username == $username
    ][0]._id)`;

  return client.fetch(query, params);
};

export default {
  name: "vendor",
  title: "Vendor",
  type: "document",
  fields: [
    {
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const isUnique = await isUniqueUsername(value, context);
          if (!isUnique) return "Username is not unique";
          return true;
        }).error(),
    },
    {
      name: "password",
      title: "Password",
      type: "string",
    },
    {
      name: "name",
      title: "Vendor Name",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "rewardMoney",
      title: "Reward Money per Scan",
      type: "number",
    },
    {
      name: "vendorId",
      title: "Vendor ID",
      type: "string",
    },
  ],
  validation: (Rule) => Rule.required(),
};
