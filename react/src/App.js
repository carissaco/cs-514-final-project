import React, { useEffect, useState } from 'react';
import { Stack, Text, PrimaryButton } from '@fluentui/react';

import './App.css';
import LoginForm from './LoginForm'
import Game from './Game'

function App(){
  const [loggedUser, setLoggedUser] = useState('');

  return (
    <Stack >
      <Stack.Item align="center">
        <Text variant={'xxLarge'}>Let's solve math word problems</Text>
      </Stack.Item>
      <LoginForm onLoginLogout={ setLoggedUser } /> {/* getting the LoginForm function from LoginForm.js. onLoginLogout is gonna be the setLoggedUser function */}
      {
        loggedUser ? (
          <Game/>
        ) : null
      }
    </Stack>
  )
}

// function App() {

// 	// user is the currently logged in user
// 	const [user, setUser] = useState(null);
// 	// title is just a sample value entered in form
// 	const [title, setTitle] = useState('');
//   const [questionObject, setQuestionObject] = useState({});
//   const [aiResponse, setAiResponse] = useState("");
	


// 	// when the user submits form...don't really do anything in this sample
// 	async function handleSubmit(event) {
//         event.preventDefault();
//         // axios.get(`https://diesel-command-442122-v6.wl.r.appspot.com/chat?title=${title}`) // my url
//         axios.get(`/getQuestion?title=${title}`)
//         .then(response => {
//           setAiResponse(response.data);
//           console.log('respond from chat', response.data)   
//         })
//         .catch(error => {
//         });
//         // do whatever on submit
//         console.log("submitted")
//   };

//   async function handleNextQuestion(event) {
//       event.preventDefault();
//       axios.get(`/nextQuestion`)
//       .then(response => {
//         setAiResponse(response.data);
//         console.log('respond from chat', response.data)   
//       })
//       .catch(error => {
//       });
//       // do whatever on submit
//       console.log("submitted")
//   };
	
// 	// this will be called by the LoginForm
// 	function HandleLogin(user) {
// 		setUser(user);
		
// 	}

//   let mathPage  = <br/> ;
//   let questionsAndChoices;
//   if (Object.keys(questionObject).length) { // if the title is not empty -- if the title exists
//     questionsAndChoices = (
//       <form>
//         <div>{ questionObject.question }</div>
//         <div>
//           <div>{ questionObject.choices[0] } </div>
//           <div>{ questionObject.choices[1] }</div>
//           <div>{ questionObject.choices[2] }</div>
//         </div>
//       </form>
//     )
//   }
//   if (user){
//     mathPage = (
//       <div>
//         <h1>Let's solve math word problems</h1>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Enter a topic:
//           </label>
//           <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          
//           <br />
//           <button type="submit" >Submit</button>
//         </form>
//         <button onClick={handleNextQuestion}>Next Question</button>
//         { questionsAndChoices }

//       </div>
//     )
//   } 
	
//   // We have a subcomponent LoginForm and we pass it the function to call when login happens
//   return (
//     <div >
      
//       <LoginForm LoginEvent={HandleLogin} />
     
//       { mathPage }    
      
//     </div>
//   );
// }

export default App;