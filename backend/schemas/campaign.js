export default {
    name : 'campaign',
    title : 'Campaign',
    type : 'document',
    fields : [
        {
            name: 'campaignName',
            title: 'Campaign Name',
            type : 'string'
        },
        {
            name: 'rewardAmount',
            title: 'Reward Amount',
            type : 'number'
        },
        {
            name: 'fundingAmount',
            title: 'Funding Amount',
            type : 'number'
        },
        {
            name: 'vendorName',
            title: 'Vendor Name',
            type : 'string'
        },
        {
            name: 'campaignAddress',
            title: 'Contract Address',
            type : 'string'
        },
        {
            name: 'promoter',
            title: 'Promoters',
            type : 'array',
            of : [
                {
                    type : 'string',
                }
            ]
        },
        {
            name: 'post',
            title: 'Posts',
            type : 'array',
            of : [
                {
                    type : 'string',
                }
            ]
        },
    ]
}