import React from 'react';
import Box from '../../../atoms/box';
import Image from '../../../atoms/image';
import {Text} from 'react-native-svg';
import {View} from 'react-native';
const ContentFull = ({blogPageImage}) => {
  console.log('blogPageImage123: ', blogPageImage);
  return (
    <Box>
      <Text>hello world</Text>
    </Box>
    // <Image
    //   style={{width: '100%', height: 70, marginTop: '49%'}}
    //   source={{
    //     uri: blogPageImage,
    //   }}
    // />
  );
};
export default ContentFull;
