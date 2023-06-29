// schema.js

export default {
    name: 'notification',
    type: 'document',
    title: 'Notification',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
      },
      {
        name: 'image',
        type: 'image',
        title: 'Image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'read',
        type: 'boolean',
        title: 'Read',
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
      },
    ],
    preview: {
      select: {
        title: 'title',
        media: 'image',
      },
    },
  };
  