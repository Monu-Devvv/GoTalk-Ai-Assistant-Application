import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import Features from '../components/Features';
import { dummyMessages } from '../constants';
import { apiCall } from '../api/openAi';

export default function HomeScreen() {
  // ── Bug 1: variable was "message" but used as "messages" everywhere — unified to "messages"
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording]   = useState(false);
  const [speaking, setSpeaking]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState('');
  const scrollViewRef = useRef();

  // ── Speech recognition events (expo-speech-recognition)
  useSpeechRecognitionEvent('result', (event) => {
    setResult(event.results[0]?.transcript || '');
  });

  useSpeechRecognitionEvent('end', () => {
    setRecording(false);
    fetchResponse();
  });

  const startRecording = async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert('Permission', 'Microphone permission is required.');
        return;
      }
      setResult('');
      setRecording(true);
      ExpoSpeechRecognitionModule.start({ lang: 'en-US', continuous: false });
    } catch (error) {
      console.log('startRecording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      ExpoSpeechRecognitionModule.stop();
      setRecording(false);
    } catch (error) {
      console.log('stopRecording error:', error);
    }
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      // ── Bug 2: "messages" was undefined — now correctly using state
      let newMessages = [...messages];
      newMessages.push({ role: 'user', content: result.trim() });
      // ── Bug 3: "newMessages" typo was "newMessage" — fixed
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);

      apiCall(result.trim(), newMessages).then(res => {
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setResult('');
          // speak the last assistant reply
          const lastMsg = res.data[res.data.length - 1];
          if (lastMsg?.role === 'assistant' && !lastMsg.content.includes('https')) {
            startSpeaking(lastMsg.content);
          }
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const startSpeaking = (text) => {
    setSpeaking(true);
    Speech.speak(text, {
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setSpeaking(false);
  };

  const clear = () => {
    setMessages([]);
    stopSpeaking();
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">

        {/* Bot icon */}
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/bot.png')}
            style={{ height: hp(15), width: hp(15) }}
          />
        </View>

        {/* Features or Messages */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text style={{ fontSize: wp(5) }} className="text-gray-700 font-semibold ml-1">
              Assistant
            </Text>
            {/* ── Bug 4: "rounded-3*1" is invalid Tailwind — fixed to "rounded-3xl" */}
            <View style={{ height: hp(50) }} className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}
              >
                {messages.map((msg, index) => {
                  if (msg.role === 'assistant') {
                    if (msg.content.includes('https')) {
                      return (
                        <View key={index} className="flex-row justify-start">
                          {/* ── Bug 5: "rounded-2*1" invalid — fixed to "rounded-2xl" */}
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                            <Image
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{ height: wp(60), width: wp(60) }}
                              source={{ uri: msg.content }}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={index}
                          style={{ width: wp(70) }}
                          className="bg-emerald-100 rounded-xl p-2 rounded-tl-none"
                        >
                          <Text>{msg.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{ width: wp(70) }}
                          className="bg-white rounded-xl p-2 rounded-tr-none"
                        >
                          <Text>{msg.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* Recording / Loading buttons */}
        <View className="flex justify-center items-center">
          {loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={{ width: hp(10), height: hp(10) }}
            />
          ) : recording ? (
            // ── Bug 6: TouchableOpacity had no onPress — fixed with stopRecording
            <TouchableOpacity onPress={stopRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/voiceLoading.gif')}
                style={{ width: hp(10), height: hp(10) }}
              />
            </TouchableOpacity>
          ) : (
            // ── Bug 7: TouchableOpacity had no onPress — fixed with startRecording
            <TouchableOpacity onPress={startRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/recordingIcon.png')}
                style={{ width: hp(10), height: hp(10) }}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
            >
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-2 absolute left-10"
            >
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
}
