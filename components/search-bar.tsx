import { icons } from '@/constants/icons'
import {View, Text, Image, TextInput} from 'react-native'

const SearchBar = ({placeholder, onPress}: {
    placeholder?: string,
    onPress?: () => void,
}) => {
  return (
    <View className='flex-row items-center bg-dark-200  px-5 rounded-full py-4'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#a8b5db" />
        <TextInput
            onPress={onPress}
            placeholder={placeholder}
            value=""
            onChangeText={()=>{}}
            placeholderTextColor="#a8b5db"
            className="flex-1 ml-2 text-white"
        />
    </View>
  )
}
export default SearchBar