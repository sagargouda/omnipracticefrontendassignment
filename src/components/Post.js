import React from 'react';
import Timestamp from "react-timestamp";
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../utils/firebase";
import {useSelector} from "react-redux";

function Post({post , currentUser , time , id }) {
    // console.log(post , currentUser , time)
    const selector = useSelector(store => store.user)
    async function deletePost(id){
        await deleteDoc(doc(db, `users/${selector?.uid}/posts`, id));
    }
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 max-w-xl mx-auto">
            <div className="flex items-start space-x-4">
                {/* User Profile Picture Placeholder */}
                <div className="flex-shrink-0">
                    <img
                        className="h-12 w-12 rounded-full"
                        src="https://via.placeholder.com/150"
                        alt={`${currentUser}'s profile`}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-800 font-bold">{currentUser}</p>
                            <p className="text-gray-600 text-sm">@{currentUser?.toLowerCase().replace(/\s+/g, '')}</p>
                        </div>
                        {time && time.seconds && (
                            <p className="text-gray-500 text-xs">
                                <Timestamp relative date={new Date(time.seconds * 1000)}/>
                            </p>
                        )}
                    </div>
                    <p className="text-gray-700 mt-2">{post}</p>
                    <div className="mt-2 flex space-x-4">


                            <button
                                onClick={() => deletePost(id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                Delete
                            </button>


                    </div>
                </div>
            </div>
        </div>

    );
}

export default Post;