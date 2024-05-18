import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Headerr from '../ReuseableComp/Headerr';
import AddMedicineModal from './smartPrescriptionAddMedicine';

interface Medicine {
  id: number;
  name: string;
}

interface Medicine2 {
  id: number;
  name: string;
}

interface Medicine3 {
  id: number;
  name: string;
}

interface Test {
  id: number;
  name: string;
}

const SmartPrescriptionPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicines2, setMedicines2] = useState<Medicine2[]>([]);
  const [medicines3, setMedicines3] = useState<Medicine3[]>([]);
  const [tests, setTests] = useState<Test[]>([]);

  const addMedicine = (name: string) => {
    const newMedicine: Medicine = {
      id: Date.now(),
      name: name,
    };
    setMedicines([...medicines, newMedicine]);
  };

  const deleteMedicine = (id: number) => {
    console.log('id', id);
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };


  
  const addMedicine2 = (name: string) => {
    const newMedicine: Medicine2 = {
      id: Date.now(),
      name: name,
    };
    setMedicines2([...medicines, newMedicine]);
  };

  const deleteMedicine2 = (id: number) => {
    console.log('id', id);
    setMedicines2(medicines.filter(medicine => medicine.id !== id));
  };


  
  
  const addMedicine3 = (name: string) => {
    const newMedicine: Medicine3 = {
      id: Date.now(),
      name: name,
    };
    setMedicines3([...medicines, newMedicine]);
  };

  const deleteMedicine3 = (id: number) => {
    console.log('id', id);
    setMedicines3(medicines.filter(medicine => medicine.id !== id));
  };

  const addTest = (name: string) => {
    const newTest: Test = {
      id: Date.now(),
      name: name,
    };
    setTests([...tests, newTest]);
  };

  const deleteTest = (id: number) => {
    setTests(tests.filter(test => test.id !== id));
  };





  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddMedicine2Modal, setShowAddMedicine2Modal] = useState(false);
  const [showAddMedicine3Modal, setShowAddMedicine3Modal] = useState(false);

  const handleAddMedicine = () => {
    // Logic to add medicine
  };

  const handleAddMedicine2 = () => {
    // Logic to add medicine 2
  };

  const handleAddMedicine3 = () => {
    // Logic to add medicine 3
  };


  return (
    <View style={styles.container}>
        {/* <Headerr user={true} height={true} /> */}
        <Headerr secndheader={true} label="SMART PRESCRIPTION" />
      <ScrollView>
        <Text style={styles.sectionHeader}>Frequently Used Medicines</Text>

         {/* Frequently Used Medicine */}
        <View style={styles.flatViewMainParent}>
          <View style={styles.flatViewSubParent}>
            <FlatList
              data={medicines}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <View style={styles.itemNameParent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>

                  <View style={styles.ButtonParent}>
                    <TouchableOpacity
                      style={styles.DeleteButton}
                      onPress={() => deleteMedicine(item.id)}>
                      <Icon name="x" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={() => }
                    >
                      <Icon name="edit" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>

          <TouchableOpacity
            style={styles.container1}
            onPress={() =>
              addMedicine(
                'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
              )
            }>
            <View style={styles.row}>
              <View style={styles.plusIconContainer}>
                <View style={styles.plusIconBackground}>
                  <Icon name="plus" size={24} color="white" />
                </View>
              </View>
              {/* <TouchableOpacity
                onPress={() =>
                  addMedicine(
                    'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
                  )
                }
                style={styles.addButton1}>
                <Text style={styles.addButtonText1}>Add Medicine</Text>
              </TouchableOpacity> */}

    <TouchableOpacity onPress={() => setShowAddMedicineModal(true)}>
    <Text style={styles.addButtonText1}>Add Medicine</Text>
          </TouchableOpacity>
      <AddMedicineModal
        visible={showAddMedicineModal}
        onClose={() => setShowAddMedicineModal(false)}
        onAdd={handleAddMedicine}
      />

            </View>
          </TouchableOpacity>
        </View>

        {/* Frequently used test */}
        <Text style={styles.sectionHeader}>Frequently Used Tests</Text>
        <View style={styles.flatViewMainParent}>
          <View style={styles.flatViewSubParent}>
            <FlatList
              data={medicines2}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <View style={styles.itemNameParent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>

                  <View style={styles.ButtonParent}>
                    <TouchableOpacity
                      style={styles.DeleteButton}
                      onPress={() => deleteMedicine2(item.id)}>
                      <Icon name="x" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={() => }
                    >
                      <Icon name="edit" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>

          <TouchableOpacity
            style={styles.container1}
            onPress={() =>
              addMedicine2(
                'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
              )
            }>
            <View style={styles.row}>
              <View style={styles.plusIconContainer}>
                <View style={styles.plusIconBackground}>
                  <Icon name="plus" size={24} color="white" />
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  addMedicine2(
                    'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
                  )
                }
                style={styles.addButton1}>
                <Text style={styles.addButtonText1}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Frequently Used Instructions */}
           {/* Frequently used test */}
           <Text style={styles.sectionHeader}>Frequently Used Instructions</Text>
        <View style={styles.flatViewMainParent}>
          <View style={styles.flatViewSubParent}>
            <FlatList
              data={medicines3}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <View style={styles.itemNameParent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>

                  <View style={styles.ButtonParent}>
                    <TouchableOpacity
                      style={styles.DeleteButton}
                      onPress={() => deleteMedicine3(item.id)}>
                      <Icon name="x" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={() => }
                    >
                      <Icon name="edit" style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>

          <TouchableOpacity
            style={styles.container1}
            onPress={() =>
              addMedicine3(
                'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
              )
            }>
            <View style={styles.row}>
              <View style={styles.plusIconContainer}>
                <View style={styles.plusIconBackground}>
                  <Icon name="plus" size={24} color="white" />
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  addMedicine3(
                    'New Medicine this is awesome medicne i nlakdnlkfdslakf jlka klja   lad fljalf',
                  )
                }
                style={styles.addButton1}>
                <Text style={styles.addButtonText1}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    // padding: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    margin: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    // width:'90%',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 15,
    color: '#02BB92',
    fontWeight: 'bold',
  },
  addButton: {
    // backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    // marginTop: 20,
    // margin:10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 20,
  },
  plusIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconBackground: {
    borderRadius: 40,
    backgroundColor: 'orange',
    // padding: 5,
  },
  container1: {
    // backgroundColor: 'red',
    height:50
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton1: {
    // backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText1: {
    color: '#ffa500',
    // fontWeight: 'bold',
    fontSize: 20,
  },
  itemName: {
    color: '#194E5C',
    fontWeight: 'bold',
    borderBottomWidth: 0.5, // Add bottom border
    borderBottomColor: 'gray', // Border color
    paddingBottom: 5,
    fontSize: 17,
  },
  flatViewMainParent: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
  },
  flatViewSubParent: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  itemNameParent: {
    width: '85%',
  },
  ButtonParent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DeleteButton: {
    marginRight: 5,
    borderWidth: 2,
    borderColor: '#4ebfb2',
    borderRadius: 10,
  },
});

export default SmartPrescriptionPage;
