import { createClient } from "@sanity/client";

import ImageUrlBuilder from "@sanity/image-url";
import {PROJECT_ID,API_VERSION,DATASET} from "@env"
export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: true,
  apiVersion: API_VERSION,
});

const builder = ImageUrlBuilder(client);
export const urlFor = (source: string) => builder.image(source);

export const getCategory = async () => {
  const items = await client.fetch('*[_type == "category"]').then((data) => {
    return data;
  });
  return items;
};

export const getCategoryTitle = async (id: string) => {
  const items = await client
    .fetch(
      `*[_type == "category" && $id in category[] ->_id]]{
        title
        }
    `,
      { id }
    )
    .then((data) => {
      return data;
    });
  return items;
};

export const getCategoryItemmsById = async (id: string) => {
  const items = await client
    .fetch(`*[_type == "items" && $id in category[] ->_id]`, { id })
    .then((data) => {
      return data;
    });

  return items;
};

export const getMainImgeById = async (id: string) => {
  const items = await client
    .fetch(`*[_type == "items" && _id == $id]`, { id })
    .then((data) => {
      return data;
    });

  return items;
};

export const getAllImage = async () => {
  const items = await client.fetch('*[_type == "items"]').then((data) => {
    return data;
  });
  return items;
};


export const getImageFromSearch = async (id:string) => {
  const items = await client.fetch(`*[_type == "items" && title match "*${id}*"]`).then((data) => {
    return data;
  });
  return items;
};

