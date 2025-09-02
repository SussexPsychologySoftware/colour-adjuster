import {TextInput} from 'react-native';
import {globalStyles} from "@/styles/appStyles";

export default function NumericInput({value, onChange, placeholder}: {value: string, onChange: (text: string) => void, placeholder?: string}) {

    const handleChangeText = (text: string) => {
        const numericAnswer = text.replace(/[^0-9]/g, '');
        onChange(numericAnswer);
    }

    return (
        <TextInput
            keyboardType="numeric"
            placeholder={placeholder??''}
            placeholderTextColor={'grey'}
            value={value}
            onChangeText={handleChangeText}
            style={[globalStyles.input,{width: 100}]}
            autoComplete="off"
        />
    )
}
