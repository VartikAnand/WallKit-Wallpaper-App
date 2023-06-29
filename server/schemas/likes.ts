// likes.ts

export default {
    name: 'likes',
    type: 'document',
    title: 'Likes',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
      },
      {
        name: 'likesCount',
        title: 'Likes Count',
        type: 'number',
      },
    ],
  };
  