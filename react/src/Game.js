import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    TextField, PrimaryButton, Stack, StackItem, ChoiceGroup, 
    Label, Spinner 
} from '@fluentui/react';
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";

function Game({userScore, loggedUser, setUserScore}){
    const [topic, setTopic] = useState(''); 
    const sectionStackTokens= { childrenGap: 10 }
    const [topicError, setTopicError] = useState(null)
    const [aiQuestion, setAIQuestion] = useState(null)
    const [userAnswerSelected, setUserAnswerSelected] = useState(null)
    const [userAnswerSubmitted, setUserAnswerSubmitted] = useState(null)
    const [loadingQuestion, setLoadingQuestion] = useState(false)

    function handleTitleChange(event){
        setTopic(event.target.value)
        setTopicError(null)
    }

    function handleSubmitTopic(){
        if (topic === ''){
            setTopicError("Don't forget to type a topic!")
        } else{
            setTopicError(null)
            setAIQuestion(null)
            setUserAnswerSubmitted(null)
            setUserAnswerSelected(null)
            getAIQuestion()  
        }
        

    }
    async function getAIQuestion() {
        // axios.get(`https://diesel-command-442122-v6.wl.r.appspot.com/chat?title=${title}`) // my url
        setLoadingQuestion(true)
        axios.get(`/getQuestion?title=${topic}`)
        .then(response => {
            setAIQuestion(response.data);
            setLoadingQuestion(false)
            console.log('respond from chat', response.data)   
        })
        .catch(error => {
        });
        // do whatever on submit
        console.log("submitted")
    };

    function handleNextQuestion(){
        setAIQuestion(null)
        setUserAnswerSubmitted(null)
        setUserAnswerSelected(null)
        getAIQuestion()
    }

    function onSelect(ev, option) {
        console.dir(option);
        setUserAnswerSelected(option);
      }

    async function handleSubmitAnswer() {
        if(userAnswerSelected != null){
            // update question count
            const updateUserScore = {
                questionCount : userScore.questionCount + 1,
            }
            // compare to AI answer
            if(userAnswerSelected.key === aiQuestion.answer){
                console.log("correct!")
                // update correct question count
                updateUserScore.correctCount = userScore.correctCount + 1 
                setUserAnswerSubmitted(true)
            } else{
                // say incorrect and display solution
                console.log("incorrect")
                setUserAnswerSubmitted(false)
            }
            // update firebase with updated userScore
            await setDoc(doc(collection(db, "UserScore"), loggedUser.uid), updateUserScore);
            setUserScore(updateUserScore)
        }
    }

    let questionStack = null;
    if (aiQuestion){
        const options = [
            { key: 'A', text: 'A: ' + aiQuestion.answerChoices.A },
            { key: 'B', text: 'B: ' + aiQuestion.answerChoices.B },
            { key: 'C', text: 'C: ' + aiQuestion.answerChoices.C },
            { key: 'D', text: 'D: ' + aiQuestion.answerChoices.D },
          ];

        questionStack = (
            <Stack>
                <Stack.Item>{aiQuestion.problem}</Stack.Item>
                <Stack.Item>
                    <ChoiceGroup options={options} label="Pick one" required={true} onChange={onSelect} />
                    </Stack.Item>
                <Stack.Item>
                    {
                        !userAnswerSubmitted
                        ? <PrimaryButton onClick={handleSubmitAnswer} text="Submit Answer"/> 
                        : null
                    }
                </Stack.Item>
            </Stack>
        )
    
    }
    let answerStack = null;
    if (userAnswerSubmitted !== null){
        if (userAnswerSubmitted === true){
            answerStack = (
                <Stack>
                    <Stack.Item>Correct!</Stack.Item>
                    <Stack.Item>{aiQuestion.solutionDescription}</Stack.Item>
                </Stack>
            )
        } else {
            // display the correct solution
            answerStack = (
                <Stack>
                    <Stack.Item>Incorrect. The answer is {aiQuestion.answer}</Stack.Item>
                    <Stack.Item>{aiQuestion.solutionDescription}</Stack.Item>
                </Stack>
            )
        }
       
    }
    
    
    return(
        <Stack tokens={sectionStackTokens}>
            <TextField 
                onChange={handleTitleChange} 
                label="Enter a Topic: " 
                placeholder="Enter something you are interested in"
                errorMessage={topicError} 
                />
            <PrimaryButton text="Submit Topic" onClick={handleSubmitTopic} />
            {loadingQuestion ? <Spinner label="Generating question..." />  : null} {/*  if loading question is true, display spinner, if false, display nothing*/}
            { aiQuestion ? questionStack : null }
            { answerStack }
            { 
                answerStack 
                ? <PrimaryButton text="Next Question" onClick={handleNextQuestion} /> 
                : null 
            }
        </Stack>
    )
}

export default Game