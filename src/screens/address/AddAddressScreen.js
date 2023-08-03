import React, {useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CrossIcon} from '../../assets/svgs';
import HomeHeader from '../home/homeHeader/HomeHeader';
import PoweredBySpryker from '../../components/PoweredBySpryker';
import CommonChipSelector from '../../components/CommonChipSelector/CommonChipSelector';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import {api} from '../../api/SecureAPI';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const SALUTATION_DATA = [
    {
      title: 'Mr.',
      value: 'Mr',
    },
    {
      title: 'Ms.',
      value: 'Ms',
    },
    {
      title: 'Mrs.',
      value: 'Mrs',
    },
  ];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedSalutationIndex, setSelectedSalutationIndex] = useState(null);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [iso2Code, setIso2Code] = useState('');

  const salutationApiData =
    SALUTATION_DATA[selectedSalutationIndex]?.value ?? null;
  const [isLoading, setIsLoading] = useState(false);

  //   const getButtonStatus = () => {
  //     if (isValidEmail(userEmail) === false || password.length === 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };
  const apiData = {
    data: {
      type: 'addresses',
      attributes: {
        customer_reference: 'DE--21',
        salutation: salutationApiData,
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: address2,
        zipCode: zipCode,
        city: city,
        country: country,
        iso2Code: 'DE',
        phone: phone,
        isDefaultShipping: false,
        isDefaultBilling: false,
      },
    },
  };

  const onPressSignUp = async () => {
    setIsLoading(true);
    await api.post('customers/DE--21/addresses', apiData).then(response => {
      console.log('response: ', response?.data?.data);
      if (response.data.status === 201) {
        setAddress1('');
        setAddress2('');
        setCity('');
        setCountry('');
        setFirstName('');
        setLastName('');
        setIso2Code('');
        setPhone('');
        setZipCode('');
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Address Added Successfully 🎉',
          position: 'top',
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong 🎉',
          position: 'top',
        });
      }
    });
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <Box flex={1} padding="s16" backgroundColor="white">
        <Box alignItems="flex-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Box padding="s4">
              <CrossIcon />
            </Box>
          </TouchableOpacity>
        </Box>
        <Box>
          <HomeHeader />
        </Box>
        <Box mt="s10">
          <Text variant="bold16">Add a new Address</Text>
        </Box>
        <Box>
          <CommonChipSelector
            title={'Salutation*'}
            DATA={SALUTATION_DATA}
            selectedIndex={selectedSalutationIndex}
            setSelectedIndex={setSelectedSalutationIndex}
          />

          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            First Name*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={firstName}
            onChangeText={text => {
              setFirstName(text);
            }}
            autoCapitalize={false}
            keyboardType="default"
            placeholderTextColor={theme.colors.lightGrey}
          />

          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Last Name*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={lastName}
            onChangeText={text => {
              setLastName(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Address1*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={address1}
            onChangeText={text => {
              setAddress1(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Address2*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={address2}
            onChangeText={text => {
              setAddress2(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Zip Code*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={zipCode}
            onChangeText={text => {
              setZipCode(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            City*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={city}
            onChangeText={text => {
              setCity(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Country*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={country}
            onChangeText={text => {
              setCountry(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />
          <Text
            variant="regular14"
            color="lightBlack"
            mr="s4"
            marginVertical="s12">
            Iso2Code*
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={iso2Code}
            onChangeText={text => {
              setIso2Code(text);
            }}
            keyboardType="default"
            autoCapitalize={false}
            placeholderTextColor={theme.colors.lightGrey}
          />

          <Box mt="s16">
            {!isLoading ? (
              <>
                <CommonSolidButton
                  title="SUBMIT"
                  onPress={onPressSignUp}
                  //   disabled={getButtonStatus()
                  disabled={false}
                />
              </>
            ) : (
              <Box
                backgroundColor="sushiittoRed"
                height={40}
                borderRadius={theme.spacing.lml}
                alignItems="center"
                justifyContent="center">
                <ActivityIndicator color={'white'} />
              </Box>
            )}
          </Box>
        </Box>
        <Box justifyContent="flex-end" flex={1} paddingVertical="s16">
          <PoweredBySpryker />
        </Box>
      </Box>
    </ScrollView>
  );
};
export default AddAddressScreen;
const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.inputGrey,
    height: 54,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    fontFamily: FONT.Primary,
  },
});
