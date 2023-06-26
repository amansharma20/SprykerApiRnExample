import React from 'react';
import {Box, Text} from '@atoms';
import {StyleSheet} from 'react-native';

const OrdertotalCost = ({orderDetail, orderShipment, orderId}) => {
  return (
    <Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text style={{fontWeight: 'bold'}}>Item Total</Text>
        <Text style={{fontWeight: 'bold'}}>
          ${orderDetail?.totals?.subtotal}
        </Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Delivery Charge</Text>
        <Text>${orderDetail?.totals?.expenseTotal}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Discount Total</Text>
        <Text>${orderDetail?.totals?.discountTotal}</Text>
      </Box>
      <Text style={styles.horizontalLine} />
      <Box flexDirection="row" justifyContent="space-between">
        <Text>Grand Total</Text>
        <Text>${orderDetail?.totals?.grandTotal}</Text>
      </Box>
      <Text style={styles.horizontalLine} />
      <Text variant="bold18">Order Details</Text>
      <Text style={styles.horizontalLine} />
      <Text style={styles.headerText}>Order Id</Text>
      <Text style={styles.subHeaderText}>{orderId}</Text>
      <Text style={styles.orderInfoText}>Payment</Text>
      <Text style={styles.orderInfoText}>
        Paid : Using {orderDetail?.payments?.[0]?.paymentMethod}
      </Text>
      <Text style={styles.orderInfoText}>Date</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.requestedDeliveryDate}
      </Text>
      <Text style={styles.orderInfoText}>Phone number</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.shippingAddress?.phone}
      </Text>
      <Text lightText>Deliver to</Text>
      <Text style={styles.orderInfoText}>
        {orderShipment?.[0]?.attributes?.shippingAddress?.address1}
      </Text>
      <Text style={styles.horizontalLine} />
    </Box>
  );
};
const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'green',
  },
  orderInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
export default OrdertotalCost;
