// import "./global.css";
// import { View, Text } from "react-native";

// export default function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-black">
//       <Text className="text-white text-2xl">
//         NativeWind Working 🚀
//       </Text>
//     </View>
//   );
// }



import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import AppNavigation from '@/navigation'

export default function App() {
  return (
   <AppNavigation />
  )
}