import React from 'react';
import { View, ImageBackground, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ob2 from '../../assets/onboardImg/ob2.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';

const MainScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ImageBackground source={ob2} style={styles.backgroundImage} resizeMode="cover">
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity style={styles.roundButton}
            onPress={() => {
              router.push("/two");
            }}
          > 
            <AntDesign name="arrowright" size={48} color={COLORS.tertiary} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.firstLineText}>AI Generated</Text>
            <Text style={styles.secondLineText}>4K Wallpaper</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 48,
  },
  roundButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: COLORS.tertiary,
  },
  textContainer: {
    alignItems: 'center',
  },
  firstLineText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  secondLineText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default MainScreen;
