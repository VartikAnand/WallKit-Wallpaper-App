import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Stack, useNavigation, useSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getImageFromSearch } from '../../sanity';
import { COLORS } from '../../constants/theme';
import MansonaryLayout from '../../components/MansonaryLayout/MansonaryLayout';

type ItemData = {
  _id: string;
  name: string;
  mainImage: string;
  title: string;
};

const Category = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const params = useSearchParams();
  const id = params.id?.toString();
  const [getItem, setGetItem] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Loading category based Image from backend
    if (id) {
      setIsLoading(true);
      setError(false);

      getImageFromSearch(id)
        .then((data) => {
          setGetItem(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(true);
          setIsLoading(false);
          console.log(err);
        });
    }
  }, []);

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
          headerTitle: `${params.id}`,
        }}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.tertiary} size="large" />
        </View>
      ) : (
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Sorry, unable to fetch data. Please try again later.
              </Text>
            </View>
          ) : (
            <>
              {getItem.length > 0 ? (
                <MansonaryLayout data={getItem} />
              ) : (
                <View style={styles.noItemContainer}>
                  <Text style={styles.noItemText}>
                    No items found in this category.
                  </Text>
                  <Text style={styles.searchText}>
                    Please search within a different category.
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  noItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noItemText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  searchText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
});

export default Category;
