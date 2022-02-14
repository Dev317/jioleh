export default {
    name : 'pin',
    title : 'Pin',
    type : 'document',
    fields : [
        {
            name : 'title',
            title : 'Title',
            type : 'string'
        },
        {
            name : 'about',
            title : 'About',
            type : 'string'
        },
        {
            name : 'destination',
            title : 'Destination',
            type : 'url'
        },
        {
            name : 'category',
            title : 'Category',
            type : 'string'
        },
        {
            name : 'image',
            title : 'Image',
            type : 'image',
            options : {
                hotspot : true // makes it possible to reponsively adapt the images to different aspect ratios at display time
            }
        },
        {   
            name: "video",
            title: "Video file",
            type: "mux.video"
        },
        {
            name : 'userId',
            title : 'UserID',
            type : 'string'
        },
        {
            name : 'postedBy',
            title : 'PostedBy',
            type : 'postedBy'
        },
        {
            name : 'save',
            title : 'Save',
            type : 'array',
            of : [{ type : 'save' }]
        },
        {
            name : 'comments',
            title : 'Comments',
            type : 'array',
            of : [{ type : 'comment' }]
        },
    ]
}