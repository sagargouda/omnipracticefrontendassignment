import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import {auth} from '../utils/firebase'
import valid from "../utils/validation";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {setDoc, doc, addDoc, collection} from 'firebase/firestore'
import {db} from '../utils/firebase'
import {addUser, removeUser} from "../redux/userSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";


function Login(props) {
    const [isSignin , setIsSignIn]  = useState(false)
    const [username , setUsername] = useState('')
    const [email , setEmail ] =useState('')
    const [ password , setPassword] = useState('')
    const [errMsg ,setErrMsg] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
//  for dispatching an action

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth ,(user)=>{
            if(user){
                const {uid , email , displayName} = user

                dispatch(addUser({uid:uid , email:email , username: displayName}))
                navigate('/app/feed')
            }
            else{
                dispatch(removeUser())
                navigate('/')
            }
        } )


        // cleanup
        return () => unsubscribe()


    } , [])

    async function handleRegister() {
        const message = valid(email, password);
        setErrMsg(message);
        if (message) return;

        if (!isSignin) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await updateProfile(user, { displayName: username });
                await setDoc(doc(db, "users", user.uid), {
                    username,
                    email,
                    createdAt: new Date().toISOString()
                });

                // for storing in a collection

                await addDoc(collection(db, `users/${user.uid}/userDetails`), {
                    username,
                    email,
                    createdAt: new Date().toISOString()
                });



                dispatch(addUser({ uid: user.uid, email: user.email, username }));
            } catch (error) {
                setErrMsg(error.message);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                setErrMsg(error.message);
            }
        }
    }



    return (
        <>
            <Header/>

            <form onSubmit={(e)=>e.preventDefault()}
                  className="w-[90%] md:w-4/12 p-12 absolute bg-black my-24 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80">
                <h1 className="font-bold text-3xl text-amber-50 mt-0 mb-6">{isSignin ? 'Login' : 'Register'}</h1>
                {
                    !isSignin ? <div>

                        <input placeholder="username" className="p-4 rounded-md my-2 w-full bg-gray-700"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)} type="text"
                               id="username"/>
                    </div> : ''

                }


                <input placeholder="enter email" className="p-4 rounded-md my-2 w-full bg-gray-700" value={email}
                       onChange={(e) => setEmail(e.target.value)} type="email" id="email"/>


                <input placeholder="enter password" className="p-4 rounded-md my-2 w-full bg-gray-700" value={password}
                       onChange={(e) => setPassword(e.target.value)} type="password" id="password"/>

                <button onClick={handleRegister}
                        className="p-4 my-3 bg-blue-600 w-full font-bold  rounded-full">{isSignin ? 'Login' : 'Register'}</button>

                {/* Error message shown here*/}

                {
                    errMsg ? <h1 className="text-red-700 text-2xl font-bold">{errMsg}</h1> : null
                }


                <p className="py-4 cursor-pointer" onClick={() => {
                    setIsSignIn(prev => !prev)
                }}>{isSignin ? 'New to this app ? Register Please' : 'Already a User ? Log In Now'}</p>


            </form>

        </>

    );
}

export default Login;