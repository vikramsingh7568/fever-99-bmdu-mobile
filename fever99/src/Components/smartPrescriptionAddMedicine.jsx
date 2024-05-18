import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import ReusablePicker from './smartPrescriptionPicker';

const AddMedicineModal = ({visible, onClose, onAdd}) => {
  const [selectedOption, setSelectedOption] = useState('Default');

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  //for duration state and function
  const [duration, setDuration] = useState('');
  const durationFunction = value => {
    console.log('value is here', value);
    setDuration(value);
  };

  const data = Array.from({length: 50}, (_, index) => ({
    key: index + 1,
    label: `${index + 1}`,
    value: `${index + 1}`,
  }));

  //for days data and funtion
  const [days, setDays] = useState('');
  const daysFuntion = value => {
    console.log('value is here', value);
    setDays(value);
  };
  const data2 = [
    {key: 1, label: 'Days(s)', value: 'Days(s)'},
    {key: 2, label: 'Week(s)', value: 'Week(s)'},
    {key: 3, label: 'Month(s)', value: 'Month(s)'},
    {key: 3, label: 'Till Next Review', value: 'Till Next Review'},
  ];

  //for Frequency data and funtion
  const [frequency, setFrequency] = useState('');
  const frequencyFuntion = value => {
    console.log('value is here', value);
    setFrequency(value);
  };
  const frequencyData = [
    {key: 1, label: 'Once a day', value: 'Once a day'},
    {key: 2, label: 'Twice a day', value: 'Twice a day'},
    {key: 3, label: 'Thrice a day', value: 'Thrice a day'},
    {key: 4, label: 'Four times a day', value: 'Four times a day'},
    {key: 5, label: 'Five times a day', value: 'Five times a day'},
    {key: 6, label: 'Every hour', value: 'Every hour'},
    {key: 7, label: 'Every two hours', value: 'Every two hours'},
    {key: 8, label: 'Every four hours', value: 'Every four hours'},
    {key: 9, label: 'Once a week', value: 'Once a week'},
    {key: 10, label: 'Twice a week', value: 'Twice a week'},
    {key: 11, label: 'Five times a day', value: 'Five times a day'},
    {key: 12, label: 'Once in 15 days', value: 'Once in 15 days'},
    {key: 13, label: 'STAT (Immediately)', value: 'STAT (Immediately)'},
    {key: 14, label: 'Once a month', value: 'Once a month'},
    {key: 15, label: 'As Needed (SOS)', value: 'As Needed (SOS)'},
    {key: 16, label: 'Alternate day', value: 'Alternate day'},
  ];

  //intake data and funciton

  //for Frequency data and funtion
  const [intake, setIntake] = useState('');
  const IntakeFuntion = value => {
    console.log('value is here', value);
    setIntake(value);
  };
  const intakeData = [
    {key: 1, label: 'Not applicable', value: 'Not applicable'},
    {key: 2, label: 'Before food', value: 'Before food'},
    {key: 3, label: 'After food', value: 'After food'},
  ];

  //for dosage and timing
  const [selectedOptionDosage, setSelectedOptionDosage] = useState('');

  const handleOptionSelectDosage = option => {
    setSelectedOptionDosage(option);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedOption === 'Default' ? styles.activeTab : null,
            ]}
            onPress={() => handleOptionSelect('Default')}>
            <Text
              style={[
                styles.tabText,
                selectedOption === 'Default' ? styles.activeTabText : null,
              ]}>
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedOption === 'Free Text' ? styles.activeTab : null,
            ]}
            onPress={() => handleOptionSelect('Free Text')}>
            <Text
              style={[
                styles.tabText,
                selectedOption === 'Free Text' ? styles.activeTabText : null,
              ]}>
              Free Text
            </Text>
          </TouchableOpacity>
        </View>
        {/* if selected option is Default */}
        {selectedOption && (
          <View>
            {/* first half */}
            <View style={styles.parentDiv}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.redStarTitle}>Duration</Text>
                  <Text style={styles.redStar}>*</Text>
                </View>
                <ReusablePicker
                  data={data}
                  selectedValue={duration}
                  onValueChange={value => durationFunction(value)}
                  width={200}
                  height={200}
                />
              </View>

              <View
                style={{
                  marginTop: 18,
                }}>
                <ReusablePicker
                  data={data2}
                  selectedValue={days}
                  onValueChange={value => daysFuntion(value)}
                  width={200}
                  height={200}
                />
              </View>
            </View>
            {/* second half */}
            <View style={styles.parentDiv}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.redStarTitle}>Frequency</Text>
                  <Text style={styles.redStar}>*</Text>
                </View>

                <ReusablePicker
                  data={frequencyData}
                  selectedValue={frequency}
                  onValueChange={value => frequencyFuntion(value)}
                  width={200}
                  height={200}
                />
              </View>

              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.redStarTitle}>Intake</Text>
                  <Text style={styles.redStar}>*</Text>
                </View>
                <ReusablePicker
                  data={intakeData}
                  selectedValue={intake}
                  onValueChange={value => IntakeFuntion(value)}
                  width={200}
                  height={150}
                />
              </View>
            </View>
          </View>
        )}

        {/* Dosage and timing */}
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'grey',
            margin: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.redStarTitle}>Dosage and timing</Text>
            <Text style={styles.redStar}>*</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // padding: 5,
              margin: 5,
              borderWidth: 1,
              borderRadius:20,
              borderColor: 'grey',
            }}>
            <TouchableOpacity
              style={[
                styles.dosageBack,
                selectedOption === 'Quick Select' ? styles.selected : null,
              ]}
              onPress={() => handleOptionSelect('Quick Select')}>
              <Text
                style={[
                  styles.dosageTitle,
                  selectedOption === 'Quick Select'
                    ? styles.selectedText
                    : null,
                ]}>
                Quick Select
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dosageBack,
                selectedOption === 'Custom' ? styles.selected : null,
              ]}
              onPress={() => handleOptionSelect('Custom')}>
              <Text
                style={[
                  styles.dosageTitle,
                  selectedOption === 'Custom' ? styles.selectedText : null,
                ]}>
                Custom
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dosageBack,
                selectedOption === 'Anytime' ? styles.selected : null,
              ]}
              onPress={() => handleOptionSelect('Anytime')}>
              <Text
                style={[
                  styles.dosageTitle,
                  selectedOption === 'Anytime' ? styles.selectedText : null,
                ]}>
                Anytime
              </Text>
            </TouchableOpacity>
          </View>

         { selectedOption === 'Quick Select' && 
           <View>
 
           <View
           style={{
            flexDirection:'row',
            alignSelf:"center"
           }}
           >
            <Text
            style={{
              margin:10,
              padding:10,
              borderRadius:10,
              backgroundColor:'red',
              borderWidth:1,
            }}
            >1-0-0-0</Text>

<Text
            style={{
              margin:10,
              padding:10,
              borderRadius:10,
              backgroundColor:'red'
            }}
            >1-0-0-0</Text>

<Text
            style={{
              margin:10,
              padding:10,
              borderRadius:10,
              backgroundColor:'red'
            }}
            >1-0-0-0</Text>

<Text
            style={{
              margin:10,
              padding:10,
              borderRadius:10,
              backgroundColor:'red'
            }}
            >1-0-0-0</Text>
            </View>

          </View>}

        </View>

        <TouchableOpacity onPress={onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    padding: 20,
  },
  parentDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    borderBottomWidth: 2,
    width: '50%',
    paddingBottom: 10,
    borderColor: '#086d99',
  },
  tabText: {
    alignSelf: 'center',
    color: '#086d99',
  },
  activeTab: {
    backgroundColor: '#086d99',
  },
  activeTabText: {
    color: 'white',
  },
  redStar: {
    color: 'red',
  },
  redStarTitle: {
    marginLeft: 10,
  },
  dosageBack: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  dosageTitle: {
    color: '#035e8f',
    // fontWeight:'bold'
  },
  selected: {
    backgroundColor: '#a4d9f5',
  },
  selectedText: {
    color: '#035e8f',
  },
});

export default AddMedicineModal;
