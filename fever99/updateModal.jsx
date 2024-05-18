import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Modal from 'react-native-modal';

const UpdateModal = ({ isVisible, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  

  const handleUpdateNow = () => {
    // Open the Play Store link for your app
    Linking.openURL('https://play.google.com/store/apps/details?id=com.fever99')
      .then(() => {
        setIsUpdating(true);
        // After redirecting, close the modal
        onClose();
      })
      .catch((err) => {
        console.error('Failed to open URL: ', err);
      });
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Update Available
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          A new version of the app is available. Would you like to update now?
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ backgroundColor: '#1263AC', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 }}
            onPress={handleUpdateNow}
            disabled={isUpdating}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              {isUpdating ? 'Updating...' : 'Update Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#fa1640', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 }}
            onPress={onClose}
            disabled={isUpdating}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
