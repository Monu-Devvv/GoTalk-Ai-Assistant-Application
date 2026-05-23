import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Features from '@/components/Features';
import { dummyMessage } from '@/constants';

export default function HomeScreen() {

  const [message, setMessage] = useState(dummyMessage);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const clear = () => {
    setMessage([]);
  }

  const stopSpeaking = () => {
    setSpeaking(false);
  }

  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView className='flex-1 flex mx-5'>
        {/** bot icon */}
        <View className='flex-row justify-center'>
          <Image source={require('../../assests/image/bot.png')} style={{ height: hp(15), width: hp(15) }} />
        </View>

        {/** feature || message */}
        {
          message.length > 0 ? (
            <View className='space-y-2 flex-1'>
              <Text style={{ fontSize: wp(5) }} className='text-gray-700 font-semibold ml-1'>
                Assistant
              </Text>
              <View style={{ height: hp(50) }} className='bg-neutral-200 rounded-3*1 p-4'>
                <ScrollView bounces={false} className='space-y-4' showsVerticalScrollIndicator={false}>
                  {
                    message.map((message, index) => {
                      if (message.role == 'assistant') {
                        if (message.content.includes('https')) {
                          // its an ai image
                          return (
                            <View key={index} className='flex-row justify-start'>
                              <View className='p-2 flex rounded-2*1 bg-emerald-100 rounded-tl-none'>
                                <Image className='rounded-2*1' resizeMode='contain' style={{ height: wp(60), width: wp(60) }} source={{ uri: message.content }} />
                              </View>
                            </View>
                          )
                        } else {
                          return (
                            <View key={index} style={{ width: wp(70) }} className='bg-emerald-100 rounded-xl p-2 rounded-tl-none'>
                              <Text>
                                {message.content}
                              </Text>
                            </View>
                          )
                        }
                      } else {
                        return (
                          <View key={index} className='flex-row justify-end'>
                            <View style={{ width: wp(70) }} className='bg-white rounded-xl p-2 rounded-tr-none'>
                              <Text>
                                {message.content}
                              </Text>
                            </View>
                          </View>
                        )
                      }
                    })
                  }
                </ScrollView>
              </View>
            </View>
          ) : (
            <Features />
          )
        }

        {/** recording clear and stop button */}
        <View className='flex justify-center items-center'>
          {
            recording ? (
              <TouchableOpacity>
                <Image className='rounded-full'
                  source={require('../../assests/images/voiceLoading.gif')}
                  style={{ width: hp(10), height: hp(10) }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Image className='rounded-full'
                  source={require('../../assests/image/recordingIcon.png')}
                  style={{ width: hp(10), height: hp(10) }} />
              </TouchableOpacity>
            )
          }

          {
            message.length > 0 && (
              <TouchableOpacity onPress={clear} className='bg-neutral-400 rounded-3xl p-2 absolute right-10'>
                <Text className='text-white font-semibold'>clear</Text>
              </TouchableOpacity>
            )
          }

          {
            speaking && (
              <TouchableOpacity onPress={stopSpeaking} className='bg-red-400 rounded-3xl p-2 absolute left-10'>
                <Text className='text-white font-semibold'>Stop</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView >
    </View >
  )
}