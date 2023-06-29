import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Link, useNavigation, useRouter } from 'expo-router';
import MasonryList from '@react-native-seoul/masonry-list';
import { urlFor } from '../../sanity';

type ItemData = {
  _id: string;
  name: string;
  mainImage: string;
};

type MansonaryLayoutProps = {
  data: ItemData[];
};

const MansonaryLayout = ({ data }: MansonaryLayoutProps) => {
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <MasonryList
        data={data}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CardItem data={item as ItemData} />}
        refreshing={isLoadingNext}
        onEndReachedThreshold={0.1}
      />
      {isLoadingNext && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator color={COLORS.tertiary} size='large' />
        </View>
      )}
    </View>
  );
};

type CardItemProps = {
  data: ItemData | unknown;
};

const CardItem = ({ data }: CardItemProps) => {
  const router = useRouter();

  // Explicitly cast data to ItemData
  const itemData = data as ItemData;

  return (
    <View style={{ borderRadius: 20, overflow: 'hidden' }}>
      <TouchableOpacity
        style={{
          height: Math.round(Math.random() * 100 + 200),
          margin: 4,
        }}
        onPress={() => {
          router.push(`/images/${itemData._id}`);
        }}
      >
        <Image
          source={{ uri: urlFor(itemData.mainImage).url() }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', margin: 10,marginLeft:5, padding: 5,marginBottom:5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MansonaryLayout;
