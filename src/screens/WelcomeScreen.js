import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WelcomeScreen() {
  return (
    <SafeAreaView className='flex-1 flex  justify-around bg-white'>
        <View className='space-y-2'>
            <Text className='text-center text-4xl font-bold text-gray-700'>
                GoTalk
            </Text>
            <Text className='text-center tracking-wider text-gray-600 font-semibold'>
               The Future Is Here, Powered By Ai 
            </Text>
        </View>
    </SafeAreaView>
  )
}