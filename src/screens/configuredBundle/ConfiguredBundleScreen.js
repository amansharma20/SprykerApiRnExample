/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {commonApi} from '../../api/CommanAPI';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ConfiguredBundleScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [configuredBundleTemplate, setConfiguredBundleTemplate] = useState([]);
  const navigation = useNavigation();

  const ConfiguredBundles = ({item}) => {
    const bundle = item?.item;
    const img = configuredBundleTemplate?.included?.find(item => {
      if (item.id === bundle?.id) {
        return item?.attributes?.images?.[0]?.externalUrlLarge;
      }
    })?.attributes?.images?.[0]?.externalUrlLarge;

    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ConfigurableBundleSlotsScreen', {
              configurableBundleId: bundle?.id,
            })
          }>
          <Box
            flex={1}
            marginHorizontal="s4"
            flexShrink={1}
            mb="s8"
            borderWidth={1}
            borderColor="border"
            borderRadius={8}
            padding="s8">
            <Image
              style={{height: 120, width: '100%', resizeMode: 'contain'}}
              source={{
                uri: img ? img : '',
              }}
            />
            <Text textAlign="center">{bundle?.attributes?.name}</Text>
          </Box>
        </TouchableOpacity>
      </>
    );
  };
  useEffect(() => {
    const getConfiguredBundleTemplate = async () => {
      setIsLoading(true);
      const response = await commonApi.get(
        `configurable-bundle-templates?include=configurable-bundle-template-image-sets`,
      );
      setConfiguredBundleTemplate(response?.data?.data);
      setIsLoading(false);
    };
    getConfiguredBundleTemplate();
  }, []);
  return (
    <Box>
      <CommonHeader title="Configured Bundle" />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={configuredBundleTemplate?.data}
          renderItem={item => {
            return <ConfiguredBundles item={item} />;
          }}
        />
      )}
    </Box>
  );
};

export default ConfiguredBundleScreen;
