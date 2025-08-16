import React, {useState} from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';


export default function RadioList({ options, onSelect} : { options: string[], onSelect: (option: string)=>void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const onOptionPress = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
    }
    return(
        <>
            {options.map((option, index) => (
                <TouchableOpacity key={option} style={styles.container} onPress={()=>onOptionPress(option)}>
                    <MaterialIcons
                        name={selectedOption===option ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color="lightgrey"
                    />
                    <Text style={styles.text}>{option}</Text>
                </TouchableOpacity>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    text: {
        fontSize: 15,
        color: 'lightgrey',
    }
})



