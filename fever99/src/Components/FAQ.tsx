// 
// App.tsx
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

const faqData = [
  { question: 'What is Fever99.com?', answer: 'Fever99.com is an online healthcare platform...' },
  { question: 'How do I sign up for an account?', answer: 'To sign up for an account...' },
  { question: 'Is my personal information safe?', answer: 'Yes, we are committed to safeguarding your personal information...' },
  // Add more FAQ data here
];

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      {/* <View
        style={{alignItems:'center'}}
        > */}
      <Image 
      source={require('../../assets/images/Logo.png')}
      resizeMode='contain'
    style={{flex:0,width: wp(50),height: wp(50), alignItems: 'center', justifyContent: 'center',}}
    //   style={styles.logo} 
      
      />
      {/* </View> */}
        <Text style={styles.headerText}>Fever99 FAQ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity onPress={toggleFAQ} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <Text>{isOpen ? '-' : '+'}</Text>
      </TouchableOpacity>
      {isOpen && <Text style={styles.answerText}>{answer}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  faqContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerText: {
    marginTop: 10,
  },
});

export default App;
