import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Text} from '@atoms';

const HomeScreen = () => {
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
        console.log('data: ', data);

        // setBlogPageData(data?.data?.blogPage);

        // console.log(data?.data?.blogPage, 'hey ashu');
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse</Text>
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
