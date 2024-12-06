import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, PrimaryButton, Stack, StackItem, ChoiceGroup } from '@fluentui/react';
 

function Game(){
    const [topic, setTopic] = useState(''); 
    const sectionStackTokens= { childrenGap: 10 }
    const [topicError, setTopicError] = useState(null)
    const [aiQuestion, setAIQuestion] = useState(null)
    const [userAnswerSelected, setUserAnswerSelected] = useState(null)
    const [userAnswerSubmitted, setUserAnswerSubmitted] = useState(null)

    function handleTitleChange(event){
        setTopic(event.target.value)
        setTopicError(null)
    }

    function handleSubmitTopic(){
        if (topic === ''){
            setTopicError("Don't forget to type a topic!")
        } else{
            setTopicError(null)
            getAIQuestion()
        }
        

    }
    async function getAIQuestion() {
        // axios.get(`https://diesel-command-442122-v6.wl.r.appspot.com/chat?title=${title}`) // my url
        axios.get(`/getQuestion?title=${topic}`)
        .then(response => {
            setAIQuestion(response.data);
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

    function handleSubmitAnswer(){
        if(userAnswerSelected != null){
            // compare to AI answer
            if(userAnswerSelected.key === aiQuestion.answer){
                console.log("correct!")
                setUserAnswerSubmitted(true)
            } else{
                // say incorrect and display solution
                console.log("incorrect")
                setUserAnswerSubmitted(false)
            }
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