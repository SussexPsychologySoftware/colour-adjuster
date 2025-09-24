import {TextInput} from 'react-native';
import {globalStyles} from "@/styles/appStyles";

export default function NumericInput({value, onChange, placeholder, maxLength}: {value: string, onChange: (text: string) => void, placeholder?: string, maxLength?: number}) {

    const handleChangeText = (text: string) => {
        const numericAnswer = text.replace(/[^0-9]/g, '');
        onChange(numericAnswer);
    }

    return (
        <TextInput
            keyboardType="numeric"
            placeholder={placeholder??''}
            placeholderTextColor={'#aaaaaa'}
            value={value}
            onChangeText={handleChangeText}
            style={[globalStyles.input]}
            autoComplete="off"
            maxLength={maxLength}
            disableFullscreenUI={true}
        />
    )
}
