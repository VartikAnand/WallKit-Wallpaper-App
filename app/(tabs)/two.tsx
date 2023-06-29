import { View, Text, SafeAreaView ,useColorScheme} from 'react-native'
import React, { useState } from 'react';
import SearchBtn from '../../components/SearchBtn/SearchBtn'
import { COLORS } from '../../constants/theme'
import ImgGrid from '../../components/ImgGrid/imgGrid';
import { useRouter } from 'expo-router';





const Home = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [searchTerm, setSearchTerm] = useState("");

 
  return (
<SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? COLORS.primary : 'white' }}>
      <SearchBtn
      
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleClick={() => {
        if (searchTerm) {
          router.push(`/search/${searchTerm}`);
        }
      }}
      />
      <View style={{ flex: 1}}>
        <ImgGrid/>
      </View>
    
    </SafeAreaView>
  )
}

export default Home