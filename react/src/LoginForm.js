//import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";
import { Stack, Text, PrimaryButton, DefaultButton } from '@fluentui/react';


function LoginForm({ onLoginLogout }){

	const [loggedUser, setLoggedUser] = useState('');

	const signInWithGoogle = async () => {
  		const provider = new GoogleAuthProvider();
  		const auth = getAuth();
  		// signInWithRedirect(auth, provider)

		try {
			const result = await signInWithPopup(auth, provider);
			onLoginLogout(result.user);
			console.log(result.user);
			setLoggedUser(result.user);
			const docRef = doc(db, "UserScore", result.user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("UserScore doc exists.", docSnap.data());
				return;
			} 
			// Add UserScore doc
			try {
				await setDoc(doc(collection(db, "UserScore"), result.user.uid), {
					email: result.user.email,
					score: 100
				});
				console .log("Document written with ID: ", result.user.uid);
			} catch (e) {
				console.error("Error adding document: ", e);
			}
		} catch (e) {
			// Handle Errors here.
			console.error(e);
		}
	};
	
	// function to sign out
	function logoutGoogle () {
		onLoginLogout(null);
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
    			
    			
    			setLoggedUser(user);
				onLoginLogout(user);
    		
  			} else {
    		// No user is signed in.
    			console.log("No user is signed in.");
  			}
  		});
	}, []);

	return (
		loggedUser ? (
			<Stack.Item align="center">
				<DefaultButton onClick={logoutGoogle} text="Log out"/>
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