/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {api} from '../../api/SecureAPI';
import {ActivityIndicator, Button} from 'react-native';
import {AuthContext} from '../../navigation/StackNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerDetails} from '../../redux/profileApi/ProfileApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

export default function PersonalDetailsScreen() {
  const {signOut} = useContext(AuthContext);
  const dispatch = useDispatch();

  const profileDataAttributes = useSelector(
    state =>
      state.getCustomerDetailsApiSlice.customerDetails?.data?.data?.[0]
        ?.attributes || [],
  );

  const [isLoading, setIsLoading] = useState(false);

  const onPressLogout = () => {
    signOut();
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerDetails('customers')).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Box flex={1} backgroundColor="background">
      {isLoading ? (
        <Box flex={1}>
          <ActivityIndicator />
        </Box>
      ) : (
        <>
          <Box flex={1}>
            <CommonHeader />
            <Box flex={1} paddingHorizontal="paddingHorizontal">
              <Box flexDirection="row" justifyContent="space-between">
                <Text>First Name</Text>
                <Text>{profileDataAttributes?.firstName}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Last Name</Text>
                <Text>{profileDataAttributes?.lastName}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Salutation</Text>
                <Text>{profileDataAttributes?.salutation}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Email</Text>
                <Text>{profileDataAttributes?.email}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Gender</Text>
                <Text>{profileDataAttributes?.gender}</Text>
              </Box>
              {/* <Box flexDirection="row" justifyContent="space-between">
                <Text>Date Of Birth</Text>
                <Text>{profileDataAttributes?.dateOfBirth}</Text>
              </Box> */}
            </Box>
          </Box>
        </>
      )}
      <Box>
        <Button title="Logout" onPress={onPressLogout} />
      </Box>
    </Box>
  );
}
