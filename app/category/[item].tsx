import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, useColorScheme } from 'react-native';
import { Stack, useNavigation, useSearchParams } from 'expo-router';
import MansonaryLayout from './../../components/MansonaryLayout/MansonaryLayout';
import { COLORS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getCategoryItemmsById } from '../../sanity';

type ItemData = {
  _id: string;
  name: string;
  mainImage: string;
  title: string;
};

const Category = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const param = useSearchParams();
  const id = param.item?.toString();
  const [getCategoryItem, setGetCategoryItem] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Loading category base Image from backend
    if (id) {
      setIsLoading(true);
      getCategoryItemmsById(id)
        .then((data) => setGetCategoryItem(data))
        .catch((err) => alert(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <ScrollView
      style={{
        width: '100%',
        height: '100%',
        paddingHorizontal: 4,
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="arrow-left"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginLeft: 8, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerTitle: 'Categories',
        }}
      />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={COLORS.tertiary} size="large" />
        </View>
      ) : (
        <>
          {getCategoryItem.length > 0 ? (
            <MansonaryLayout data={getCategoryItem} />
          ) : (
            <Text>No Item Found ..</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Category;
