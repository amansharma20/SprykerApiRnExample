import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {Image} from 'react-native';

const ContentFullSection = () => {
  const [blogPageImage, setBlogPageImage] = useState();

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

  return (
    <Box>
      <Image
        style={{width: '100%', height: 150, resizeMode: 'contain'}}
        source={{
          uri: blogPageImage,
        }}
      />
    </Box>
  );
};
export default ContentFullSection;
