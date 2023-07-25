/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SyncedList} from './components';
import {listData} from './mock-data';
import {DUMMYDATA} from './dummy-data';
import {api} from '../../api/SecureAPI';
import axios from 'axios';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import ProductItemNew from '../../components/ProductItemNew';

const SushittoHomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  console.log('isLoading: ', isLoading);

  const [apiData, setApiData] = useState([]);
  // console.log('apiData: ', apiData);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchData = async () => {
        await axios
          .get(
            'https://categoriestree-5g04sc.5sc6y6-2.usa-e2.cloudhub.io/catalogsearch',
          )
          .then(response => {
            console.log('response.status: ', response.status);
            // console.log('response: ', response);
            console.log('response.data: ', response.data);
            setApiData(response.data);
            setIsLoading(false);
          });
      };
      fetchData();
    } catch (error) {
      console.log('error: ', error);
      setIsLoading(false);
    }
  }, []);

  const renderHorizontalItem = (
    // @ts-ignore
    index: number,
    isSelected: boolean,
    item: any,
  ) => {
    return (
      <View style={styles.horizontalItemWrapper}>
        <View
          style={
            isSelected
              ? [styles.itemContainer, styles.itemContainerSelected]
              : styles.itemContainer
          }>
          <Text>{item.title}</Text>
        </View>
      </View>
    );
  };

  const renderVerticalItem = (item: any, index: Number) => {
    return (
      <>
        {/* <View style={styles.verticalItemContainer}>
        <Text>{item.attributes?.name}</Text>
      </View> */}
        <ProductItemNew
          item={item?.attributes}
          includedData={undefined}
          index={index}
        />
      </>
    );
  };

  const renderSectionHeader = (section: any) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.innerHeaderContainer}>
          <Text style={styles.header}>{section.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title={'Sushiitto Menu'} onPress={undefined} showCartIcon />
      {isLoading ? (
        <>
          <ActivityIndicator />
        </>
      ) : (
        <>
          <SyncedList
            // data={listData}
            // data={DUMMYDATA.data.Menu}
            data={apiData}
            horizontalListContainerStyle={styles.horizontalListContainerStyle}
            renderHorizontalItem={renderHorizontalItem}
            renderSectionHeader={renderSectionHeader}
            renderVerticalItem={renderVerticalItem}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: 'white',
  },
  header: {
    color: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  horizontalItemWrapper: {
    borderRadius: 7,
    overflow: 'hidden',
  },
  horizontalListContainerStyle: {
    paddingBottom: 6,
  },
  innerHeaderContainer: {
    backgroundColor: 'gray',
    borderRadius: 3,
    height: 23,
    justifyContent: 'center',
    paddingHorizontal: 12,
    width: '100%',
  },
  itemContainer: {
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainerSelected: {
    backgroundColor: 'lightblue',
  },
  verticalItemContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 4,
    marginBottom: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});

export default SushittoHomeScreen;
