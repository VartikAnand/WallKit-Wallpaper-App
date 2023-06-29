import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { COLORS } from '../../constants/theme';
import MansonaryLayout from '../MansonaryLayout/MansonaryLayout';
import { getAllImage } from '../../sanity';

type ItemData = {
  _id: string;
  name: string;
  mainImage: string;
  title: string;
};



const ImgGrid = () => {
  const [isLoading, setIsLoading] = useState(true);
const [allImage, setAllImage] =useState<ItemData[]>([]); 

useEffect(() => {
  // Loading category list from backend
  getAllImage()
    .then((data) => {
      setAllImage(data);

      setIsLoading(false);
    })
    .catch(err => alert(err));
}, []);

  return (
    <ScrollView
      style={{ width: '100%', height: '100%', paddingHorizontal: 4 }}

    >
      {allImage ? (

     
    <MansonaryLayout data={allImage}/>
      ) : (
        <ActivityIndicator color={COLORS.tertiary} size='large' />
      )}
    </ScrollView>
  );
};



export default ImgGrid;
