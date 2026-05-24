import { View, Text, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const features = [
  {
    title: 'ChatGPT',
    desc: 'ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.',
    icon: require('../../assets/images/chatgptIcon.png'),
    bg: 'bg-emerald-200',
  },
  {
    title: 'DALL·E Image',
    desc: 'DALL·E can generate stunning images from your text prompts. Just describe what you want and watch it come to life.',
    icon: require('../../assets/images/dallEIcon.png'),
    bg: 'bg-violet-200',
  },
  {
    title: 'Smart Assistant',
    desc: 'Your AI-powered voice assistant is always ready to help. Just tap the mic and speak your request naturally.',
    icon: require('../../assets/images/chatgptIcon.png'),
    bg: 'bg-cyan-200',
  },
];

export default function Features() {
  return (
    <View style={{ height: hp(60) }} className="space-y-4">
      <Text style={{ fontSize: wp(6.5) }} className="font-semibold text-gray-700">
        Features
      </Text>

      {features.map((item, index) => (
        <View key={index} className={`${item.bg} p-4 rounded-xl space-y-2`}>
          <View className="flex-row items-center space-x-1">
            <Image source={item.icon} style={{ height: hp(4), width: hp(4) }} />
            <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">
              {item.title}
            </Text>
          </View>
          <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium">
            {item.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}
