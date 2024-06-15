import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import Post from "../components/Post";

function Profile() {
    const [activeTab, setActiveTab] = useState('userPosts');
    const [userPosts, setUserPosts] = useState([]);

    const user = useSelector((state) => state.user);
    const following = useSelector((state) => state.follow.following);

    useEffect(() => {
        if (user.uid) {
            const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/posts`), (querySnapshot) => {
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data(), username: user.username });
                });
                setUserPosts(fetchedPosts);
            });
            return () => unsubscribe();
        }
    }, [user.uid]);

    return (
        <div className="w-[90%] md:w-[70%] lg:w-[50%] my-10 py-10 px-10 mx-auto h-auto border-4 border-black">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <div className="text-xl">Following: {following.length}</div>
            </div>

            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 mr-2 ${activeTab === 'userPosts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('userPosts')}
                >
                    My Posts
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'following' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('following')}
                >
                    Following
                </button>
            </div>

            <div>
                {activeTab === 'userPosts' && (
                    <div>
                        <ul>
                            {userPosts.map((post) => (
                                <li key={post.id}>
                                    <Post
                                        id={post.id}
                                        post={post.post}
                                        currentUser={post.username}
                                        time={post.time}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'following' && (
                    <div>
                        <ul>
                            {following.map((follow) => (
                                <li key={follow.id} className="border-b py-2">
                                    <div className="text-lg font-semibold">{follow.username}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
