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
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // makes it possible to reponsively adapt the images to different aspect ratios at display time
      },
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
      name: "walletAddress",
      title: "Wallet Address",
      type: "string",
    },
    {
      name: "contractAddress",
      title: "Contract Address",
      type: "string",
    },
    {
      name: "location",
      title: "Location",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "hasCampaign",
      title: "Has Campaign?",
      type: "boolean",
    },
    {
      name: "campaignName",
      title: "Campaign Name",
      type: "string",
    },
    {
      name: "budget",
      title: "Campaign Budget",
      type: "number",
    },
    {
      name: "rewardAmount",
      title: "Reward Amount per Scan",
      type: "number",
    },
    {
      name: "refereeReward",
      title: "Reward Referee receives on First Visit",
      type: "string",
    },
    {
      name: "dailyLimit",
      title: "Daily Redemption Limit",
      type: "number",
    },
    {
      name: "startDate",
      title: "Campaign Start Date",
      type: "date",
    },
    {
      name: "duration",
      title: "Campaign Duration (Days)",
      type: "number",
    },
    {
      name : "pendingPayment",
      title: "Pending Payment",
      type: "boolean"
    },
    {
      name : "pendingAddresses",
      title: "Pending Addresses",
      type: "array",
      of: [{ type: "string" }],
    }
  ],
  initialValue: {
    hasCampaign: false,
  },
  validation: (Rule) => Rule.required(),
};
