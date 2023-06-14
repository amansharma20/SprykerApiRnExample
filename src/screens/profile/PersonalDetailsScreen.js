import React, {useContext, useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {api} from '../../api/SecureAPI';
import {ActivityIndicator, Button} from 'react-native';
import {AuthContext} from '../../navigation/StackNavigator';

export default function PersonalDetailsScreen() {
  const {signOut} = useContext(AuthContext);

  const [profileData, setProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserDetails = async () => {
    setIsLoading(true);
    const response = await api.get('customers');
    if (response.data.status === 200) {
      setProfileData(response.data?.data?.data[0]?.attributes);
      setIsLoading(false);
    }
  };

  const onPressLogout = () => {
    console.log('here');
    signOut();
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <Box flex={1} backgroundColor="background" paddingHorizontal="s16">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>First Name</Text>
            <Text>{profileData?.firstName}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Last Name</Text>
            <Text>{profileData?.lastName}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Salutation</Text>
            <Text>{profileData?.salutation}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Email</Text>
            <Text>{profileData?.email}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Gender</Text>
            <Text>{profileData?.gender}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Date Of Birth</Text>
            <Text>{profileData?.dateOfBirth}</Text>
          </Box>
          <Box>
            <Button title="Logout" onPress={onPressLogout} />
          </Box>
        </>
      )}
    </Box>
  );
}
