//import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";
import { Stack, Text, PrimaryButton, DefaultButton } from '@fluentui/react';


function LoginForm({ loggedUser, setLoggedUser, userScore, setUserScore }){
	async function initializeLogin(user){
		console.log(user);
		setLoggedUser(user);
		const docRef = doc(db, "UserScore", user.uid);
		const docSnap = await getDoc(docRef);
		// const unsub = onSnapshot(docRef, (doc) => {
		// 	console.log("Current data: ", doc.data());
		// });
		if (docSnap.exists()) {
			setUserScore(docSnap.data())
			console.log("UserScore doc exists.", docSnap.data());
			return;
		} 
		// Add UserScore doc
		try { // if the doc does not exist
			const userScore = {questionCount : 0 , correctCount : 0} // dictionary with userScore keys and values
			await setDoc(doc(collection(db, "UserScore"), user.uid), userScore);
			setUserScore(docSnap.data());
			console.log("Document written with ID: ", user.uid);
		} catch (e) {
			console.error("Error adding document: ", e);
		}		
	}
	const signInWithGoogle = async () => {
  		const provider = new GoogleAuthProvider();
  		const auth = getAuth();
  		// signInWithRedirect(auth, provider)

		try {
			const result = await signInWithPopup(auth, provider);
			await initializeLogin(result.user)
		} catch (e) {
			// Handle Errors here.
			console.error(e);
		}
	};
	
	// function to sign out
	function logoutGoogle () {
		const auth=getAuth();
		auth.signOut();
		setLoggedUser(null)
	}	

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
    			// User is signed in.
    			console.log("User is signed in:", user);
    		
    			
    			initializeLogin(user);
    		
  			} else {
    		// No user is signed in.
    			console.log("No user is signed in.");
  			}
  		});
	}, []);

	return (
		loggedUser ? (
			<Stack.Item>
				<Stack enableScopedSelectors horizontal horizontalAlign="space-between">
					<Text variant="large">{loggedUser.email}</Text>
					{userScore ? <Text variant="large">Questions Answered: {userScore.questionCount}</Text> : null}
					<DefaultButton onClick={logoutGoogle} text="Log out"/>
				</Stack>
			</Stack.Item>
		)
		: (
			<Stack.Item align="center">
				<PrimaryButton onClick={signInWithGoogle} text="Log in with Google to play"/>
			</Stack.Item>
		)

	)

}


export default LoginForm;