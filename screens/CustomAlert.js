import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.container}>
        <View style={styles.alertContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
