import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Text} from '@atoms';
import ContentFull from './contentFull/ContentFull';
import {useSelector, useDispatch} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
const HomeScreen = () => {
  const [blogPageImage, setBlogPageImage] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://graphql.contentful.com/content/v1/spaces/8m0ovx5oy7z6/environments/master?access_token=y9d3K_fBoCbucpnpi1_tzqtlU8yctBW-ZPpOEscF8i4',

          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              query: `

                query blogPageEntryQuery {

                  blogPage(id: "5XSN6mWNBfnnh8OZxxtR7q") {

                    publishDate

                    articleSummary

                    articleHeading

                    blogLocation {

                      lat

                      lon

                    }

                    bannerImagesCollection {

                      items {

                        url

                      }

                    }

                  }

                }

              `,
            }),
          },
        );

        const data = await response.json();

        setBlogPageImage(
          data.data.blogPage?.bannerImagesCollection?.items[0].url,
        );
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse</Text>
      <Image
        style={{width: '100%', height: 200, marginTop: '5%'}}
        source={{
          uri: blogPageImage,
        }}
      />
      {/* <ContentFull blogPageImage={blogPageImage} /> */}

      <CategorySection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
