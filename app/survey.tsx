import { useState } from "react";
import {Text, View, StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import RadioList from '@/components/RadioList'
import {DataService} from "@/services/dataService";
import {router} from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import { SafeAreaView } from "react-native-safe-area-context";

type questionType = 'text' | 'number' | 'choice';

interface DisplayCondition {
    parentQuestionId: string;
    choice: string;
}

interface Question {
    id: string;
    question: string;
    type: questionType;
    options?: string[];
    condition?: DisplayCondition;
}

interface SurveySection {
    name: string;
    title: string;
    questions: Question[]
}

export default function SurveyScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Make a survey
    const surveySpecification: SurveySection[] = [
        {
            name: 'device',
            title: 'About your device: ',
            questions: [
                {
                    id: "phone_or_computer",
                    question: "Did you do this study on a mobile device or computer device?",
                    type: 'choice',
                    options: ['Mobile', 'Computer']
                },
                {
                    id: "phone_make",
                    question: "What make is your phone?",
                    type: 'text'
                },
                {
                    id: "phone_model",
                    question: "What model is your phone?",
                    type: 'text'
                },
                {
                    id: "phone_os",
                    question: "Does your phone run on Android or iOS (Apple iPhone)?",
                    type: 'choice',
                    options: ['Android', 'iOS']
                },
                {
                    id: "true_tone",
                    question: 'Does your phone have TrueTone switched on?',
                    type: 'choice',
                    options: ['Yes', 'No', "Don't know"],
                    condition: {
                        parentQuestionId: "phone_os",
                        choice: 'iOS',
                    }
                },
                {
                    id: "blue_light_filter",
                    question: "Do you use a 'blue light filter' app (e.g. f.lux, Twilight, Iris) or setting (e.g. Night Shift on iOS or Eye Comfort Shield on Android)?",
                    type: 'choice',
                    options: ['Yes', 'No', "Don't know"],
                },
                {
                    id: "blue_light_filter_on",
                    question: 'Was the “blue light filter” switched on when you completed the task?',
                    type: 'choice',
                    options: ['Yes', 'No', "Don't know"],
                    condition: {
                        parentQuestionId: "blue_light_filter",
                        choice: 'Yes',
                    }
                },
                {
                    id: 'dark_light_mode',
                    question: "What mode do you generally use your phone in?",
                    type: 'choice',
                    options: ['Dark mode', 'Light mode', 'Don’t know', 'Other']
                },
                {
                    id: 'auto_adjust_brightness',
                    question: "Does your phone adjust brightness automatically?",
                    type: 'choice',
                    options: ['Yes', 'No', 'Don’t know']
                },
                {
                    id: 'auto_adjust_colour',
                    question: "Does your phone adjust colour automatically?",
                    type: 'choice',
                    options: ['Yes', 'No', 'Don’t know']
                },
                {
                    id: 'accessibility',
                    question: "Did you have any display accessibility settings on during the task?",
                    type: 'choice',
                    options: ['Yes', 'No', 'Don’t know']
                },
                {
                    id: 'months_had_phone',
                    question: "How long have you had this phone for? (months)",
                    type: 'number',
                },
                {
                    id: 'hours_per_day',
                    question: "Approximately how many hours per day do you spend using this phone?",
                    type: 'number',
                },
                {
                    id: 'other_display_adjustments',
                    question: "Please describe any other filter apps, adjustments or display settings that you use on your device (if there are none, or you just used default settings please state 'none')",
                    type: 'text',
                },
            ]
        },
        {
            name: 'surroundings',
            title: 'About your surroundings: ',
            questions: [
                {
                    id: 'home_or_campus',
                    question: "Where are you currently?",
                    type: 'choice',
                    options: ['At home', 'On campus'],
                },
                {
                    id: 'room',
                    question: 'What room are you in?',
                    type: 'text',
                    condition: {
                        parentQuestionId: "home_or_campus",
                        choice: 'On campus',
                    }
                },
                {
                    id: "current_lighting",
                    question: "What is the lighting like where you are sitting?",
                    type: 'choice',
                    options: ['Completely natural', 'Majority natural', 'Majority artificial', 'Completely artificial'] //[on campus] What room are you in?
                },
            ]
        },
        {
            name: 'demographics',
            title: 'About you: ',
            questions: [
                {
                    id: 'age',
                    question: "What is your age in years?",
                    type: 'number',
                },
                {
                    id: 'gender',
                    question: "What is your gender?",
                    type: 'choice',
                    options: ['Male', 'Female', 'Non-binary', 'Prefer to self describe', 'Prefer not to say']
                },
                {
                    id: 'gender_self_describe',
                    question: 'Self describe your gender:',
                    type: 'text',
                    condition: {
                        parentQuestionId: "gender",
                        choice: 'Prefer to self describe',
                    }
                },
                {
                    id: 'colour_vision_deficiency',
                    question: "Have you ever been diagnosed with a colour vision deficiency (\"colour blindness\")?",
                    type: 'choice',
                    options: ['Yes', 'No', 'Not sure']
                },
            ]
        }
    ]

    const emptyResponses = Object.fromEntries(
        surveySpecification.flatMap((section) =>
            section.questions.map((q) => [q.id, ''])
        )
    )
    const [responses, setResponses] = useState(emptyResponses);

    const testNoMissingResponses = () => {
        // TODO: could edit the surveySpecification object, set a warningFlag to highlight in red
        const isValidArray = surveySpecification.flatMap((section) =>
                section.questions.map((q) => {
                    // Return false if invalid answer
                    if(q.condition && responses[q.condition.parentQuestionId] !== q.condition.choice) return true
                    return responses[q.id] !== ''
                }
            )
        )
        console.log(isValidArray)
        console.log(!isValidArray.includes(false))
        return !isValidArray.includes(false);

    }

    const handleSubmit = async () => {
        if(isSubmitting) return
        setIsSubmitting(true)
        try {
            const validResponses = testNoMissingResponses()
            if(!validResponses){
                setWarning('Please answer all questions')
                return
            }
            setWarning('')
            const dataConsent = await DataService.getSendDataConsent()
            await DataService.saveData(responses, 'survey', dataConsent?'CdE5fn8ckU5w':undefined)
            router.replace('/debrief')
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={globalStyles.scrollViewContainer}>
            <SafeAreaView>
                {surveySpecification.map((section) => {
                    const questions = section.questions.map((q) => {
                        // Check if question should be shown based on condition
                        let isConditional = false
                        if (q.condition && responses[q.condition.parentQuestionId] !== q.condition.choice) return null; // Don't render this question
                        else if(q.condition) isConditional = true

                        let input;
                        if (q.type === 'text') {
                            input = (
                                <TextInput
                                    value={responses[q.id]}
                                    onChangeText={(text) => setResponses(prev => ({...prev, [q.id]: text}))}
                                    style={globalStyles.input}
                                />
                            );
                        }
                        if (q.type === 'number') {
                            input = (
                                <NumericInput
                                    value={responses[q.id]}
                                    onChange={(text) => setResponses(prev => ({...prev, [q.id]: text}))}
                                />
                            );
                        }
                        if (q.type === 'choice' && q.options) {
                            input = (
                                <RadioList options={q.options} onSelect={(option)=>setResponses(prev => ({...prev, [q.id]: option}))} />
                            )
                        }

                        return (
                            <View key={q.id} style={[styles.questionContainer, isConditional && styles.conditionalQuestion]}>
                                <Text style={globalStyles.question}>{q.question}</Text>
                                {input}
                            </View>
                        );
                    });

                    return (
                        <View key={section.name} style={styles.sectionContainer}>
                            <Text key={section.name + '-title'} style={globalStyles.sectionTitle}>{section.title}</Text>
                            {questions}
                        </View>
                    );
                })}
                { warning && <Text style={styles.warning}>{warning}</Text>}
                <SubmitButton text='Submit' disabledText='Submitting...' disabled={isSubmitting} onPress={handleSubmit}/>
            </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    page: {
        minHeight: '100%',
        padding: 10,
    },
    surveyContainer: {

    },
    sectionContainer: {
        gap: 12,
        marginVertical: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'lightgrey',
    },
    questionContainer: {
        gap: 5
    },
    conditionalQuestion: {
        marginLeft: 20,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    questionText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'lightgrey',
    },
    input: {
        color: 'lightgrey',
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    numericInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    radioInput: {

    },
    choiceOptionsContainer: {

    },
    radioOption: {

    },

    warning: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 5,
    },
})
