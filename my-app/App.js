import React, { useState, useCallback, useRef } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

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
      setData(response.data.data || []); // Ensure that response.data.data is an array

    } catch (err) {
      console.error(err);
    }
  }, [newVid, newPartNo, newHouse]);

  const renderCards = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return <Text>No data available</Text>;
    }

    return data.map((record, index) => (
      <ViewShot key={index} style={styles.card} options={{ format: 'png', quality: 0.9 }}>
        {/* Render your card content here */}
        <TouchableOpacity onPress={() => downloadCardAsImage(record)}>
          <View style={{ backgroundColor: 'blue', padding: 10, margin: 5 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Download Card</Text>
          </View>
        </TouchableOpacity>
      </ViewShot>
    ));
  };

  const downloadCardAsImage = async (record) => {
    try {
      const htmlContent = `
            <h1>Name: ${record.NAME}</h1>
            <p>PS Name (English): ${record.PS_NAME_EN}</p>
            <p>House No: ${record.C_HOUSE_NO}</p>
            <p>EPIC No: ${record.EPIC_NO}</p>
            <p>Part No: ${record.PART_NO}</p>
      `;

      // Ensure that viewShotRef is defined
      if (!viewShotRef.current) {
        console.error('viewShotRef is not defined');
        return;
      }

      const uri = await viewShotRef.current.capture();

      const fileName = `VoterCard_${record.NAME.replace(/\s/g, '_')}.png`;
      const pathToWrite = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.copyFile(uri, pathToWrite);

      console.log('Image saved successfully:', pathToWrite);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const viewShotRef = useRef(null);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="vid"
        value={newVid}
        onChangeText={setNewVid}
        style={styles.input}
      />
      <TextInput
        placeholder="partno"
        value={newPartNo}
        onChangeText={setNewPartNo}
        style={styles.input}
      />
      <TextInput
        placeholder="house no"
        value={newHouse}
        onChangeText={setNewHouse}
        style={styles.input}
      />
      <Button onPress={fetchData} title="Submit" />

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
});
