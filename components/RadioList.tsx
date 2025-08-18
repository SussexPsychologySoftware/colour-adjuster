import React, {useState} from 'react'
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import {globalStyles, colours} from "@/styles/appStyles";


export default function RadioList({ options, onSelect} : { options: string[], onSelect: (option: string)=>void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const onOptionPress = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
    }
    return(
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity key={option} style={styles.rowContainer} onPress={()=>onOptionPress(option)}>
                    <MaterialIcons
                        name={selectedOption===option ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={colours.text}
                    />
                    <Text style={globalStyles.text}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 15,
        color: 'lightgrey',
    }
})



