import {KeyboardAvoidingView, Platform, ScrollView, Text} from 'react-native';
import {useCallback, useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";

interface surveySpecification {
    question: string
    type: string;
    options?: string[];
}

export default function SurveyScreen() {
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const surveys: surveySpecification[] = [
    // bout your device:
        {
            question: "What make is your phone?",
            type: 'text'
        },
        {
            question: "What model is your phone?",
            type: 'text'
        },
        {
            question: "Does your phone run on Android or iOS (iPhone)?",
            type: 'choice',
            options: ['Android','iOS'] //iPhone users only - Does your phone have TrueTone switched on?
        },
        {
            question: "What browser do you use?",
            type: 'text'
        },
        {
            question: "Do you use a 'blue light filter' app or setting?",
            type: 'choice',
            options: ['yes', 'no', "don't know"] //-[If yes] Was the “blue light filter” switched on when you completed the task? Yes / No / Don’t know
        },
        {
            question: "What mode do you generally use your phone in?",
            type: 'choice',
            options: ['Dark mode', 'Light mode', 'Don’t know', 'Other']
        },
        {
            question: "Does your phone adjust brightness automatically?",
            type: 'choice',
            options: ['Yes', 'No', 'Don’t know']
        },
        {
            question: "Does your phone adjust colour automatically?",
            type: 'choice',
            options: ['Yes', 'No', 'Don’t know']
        },
        {
            question: "Did you have any display accessibility settings on during the task?",
            type: 'choice',
            options: ['Yes', 'No', 'Don’t know']
        },
        {
            question: "How long have you had this phone for? (months)",
            type: 'number',
        },
        {
            question: "Approximately how many hours per day do you spend using this phone?",
            type: 'number',
        },
        {
            question: "Please describe any other filter apps, adjustments or display settings that you use on your device (if there are none, or you just used default settings please state 'none')",
            type: 'text',
        },
        {
            question: "Where are you currently?",
            type: 'choice',
            options: ['At home', 'on campus'] //[on campus] What room are you in?
        },
        {
            question: "What is the lighting like where you are sitting?",
            type: 'choice',
            options: ['Completely natural', 'Majority natural','Majority artificial','Completely artificial'] //[on campus] What room are you in?
        },
        {
            question: "Age (years)",
            type: 'number',
        },
        {
            question: "Gender",
            type: 'choice',
            options: ['Male', 'Female','Non-binary','Prefer to self describe','Prefer not to say'] //if prefer, free text entry
        },
        {
            question: "Have you ever been diagnosed with a colour vision deficiency (\"colour blindness\")?",
            type: 'choice',
            options: ['Yes', 'No','Not sure'] //if prefer, free text entry
        },
        ]
  return (<></>);
}