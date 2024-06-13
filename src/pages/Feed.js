import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import Post from "../components/Post";
import {addFollowing} from "../redux/followSlice";


function Feed(props) {
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const selector = useSelector(store => store.user);


    function openModal() {
        setIsOpen(true);
    }

    // Getting data from Firebase to show on user feed
    useEffect(() => {
        if (selector.uid) {
            const unsubscribe = onSnapshot(collection(db, `users/${selector.uid}/posts`), (querySnapshot) => {
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                setPosts(fetchedPosts);
            });
            return () => unsubscribe();
        }
    }, [selector?.uid]);



    function handleBackdrop(e) {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    }

    // Posting posts and storing them in Firebase
    async function postData() {
        try {
            const docRef = await addDoc(collection(db, `users/${selector.uid}/posts`), {
                post: postText,
                time: serverTimestamp()
            });
            setIsOpen(false);
        } catch (e) {
            console.error('Error adding posts', e);
        }
    }


    // fetching people i am following and my followers and dispatching them in redux

async function fetchFollowing(){
        if(selector?.uid){
            const unsubscribe = onSnapshot(collection(db , `users/${selector.uid}/following `) , (query)=>{
                const followingList = [];
                query.forEach((doc)=>{
                    if(doc ){
                        const data = doc.data()
                        const following = {followingId : data.followingId , username: data.username}
                   followingList.push(following)
                    }else{
                        console.log('Document does not exist')
                    }
                })
                dispatch(addFollowing([...followingList]))
            })
        }
}


    useEffect(() => {
        fetchFollowing();
    }, []);










    return (
        <div className="w-[90%] md:w-[70%] lg:w-[50%] my-10 py-10 px-10 mx-auto h-auto border-4 border-black">
            <button onClick={openModal}
                    className="border bg-red-600 border-black font-bold text-amber-50 rounded-md p-3">Write something..
            </button>

            {isOpen && <div onClick={handleBackdrop}
                            className="w-full h-full fixed top-0 left-0 flex justify-center inset-0 items-center bg-black bg-opacity-95">
                <div className="bg-white flex flex-col p-8 rounded shadow-lg">
                    <textarea value={postText} onChange={(e) => {
                        setPostText(e.target.value);
                    }} cols="30" rows="10" className="outline-none font-bold" placeholder="write here to shine"></textarea>
                    <button onClick={() => postData()} className="bg-blue-200 font-bold mx-auto w-[50%] p-3 rounded-md">Post
                        it!!
                    </button>
                </div>
            </div>}

            <div className="container mx-auto mt-8">
                <ul>
                    {posts && posts.length > 0 && posts.map((post) => (
                        <li key={post?.id}>
                            <Post
                                id={post?.id}
                                post={post?.post}
                                currentUser={selector?.username}
                                time={post?.time}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Feed;
