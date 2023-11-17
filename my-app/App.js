import React, { useState, useCallback } from 'react';
import { Button, StyleSheet, Text, TextInput, View, StatusBar, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [data, setData] = useState([]);
  const [newVid, setNewVid] = useState('');
  const [newPartNo, setNewPartNo] = useState('');
  const [newHouse, setNewHouse] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (newVid) {
        queryParams.append('vid', newVid);
      }
      if (newPartNo) {
        queryParams.append('partNo', newPartNo.toString());
      }
      if (newHouse) {
        queryParams.append('house', newHouse);
      }

      const apiUrl = `https://voter-backend-2oi2.onrender.com/voterdata?${queryParams}`;

      const response = await axios.get(apiUrl);
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }, [newVid, newPartNo, newHouse]);

  const downloadCard = async (record) => {
    // Create a CSV string with the card information
    const csvData = `Name: ${record.NAME}\nPS Name (English): ${record.PS_NAME_EN}\nHouse No: ${record.C_HOUSE_NO}\nEPIC No: ${record.EPIC_NO}\nPart No: ${record.PART_NO}`;

    // Define the file path and name
    const filePath = `${FileSystem.documentDirectory}card_${record.EPIC_NO}.txt`;

    // Write the CSV data to a file
    await FileSystem.writeAsStringAsync(filePath, csvData);

    // Show a success message or perform any other actions
    console.log('File downloaded successfully:', filePath);
  };

  const renderCards = () => {
    if (data.length === 0) {
      return null;
    }

    return data.map((record, index) => (
      <View key={index} style={styles.card}>
        <Text>Name: {record.NAME}</Text>
        <Text>PS Name (English): {record.PS_NAME_EN}</Text>
        <Text>House No: {record.C_HOUSE_NO}</Text>
        <Text>EPIC No: {record.EPIC_NO}</Text>
        <Text>Part No: {record.PART_NO}</Text>

        {/* Add a button to trigger the download */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => downloadCard(record)}
        >
          <Text style={styles.buttonText}>Download Card</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='vid' value={newVid} onChangeText={setNewVid} style={styles.input}></TextInput>
      <TextInput placeholder='partno' value={newPartNo} onChangeText={setNewPartNo} style={styles.input}></TextInput>
      <TextInput placeholder='house no' value={newHouse} onChangeText={setNewHouse} style={styles.input}></TextInput>
      <Button onPress={fetchData} title="Submit"></Button>

      {renderCards()}

      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  downloadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
