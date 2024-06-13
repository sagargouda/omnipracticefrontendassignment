import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {collection} from "firebase/firestore";
import {db} from "../utils/firebase";
import {getDocs,  doc, setDoc, deleteDoc} from "firebase/firestore";
import {addFollowing, removeFollowing} from "../redux/followSlice";

function User(props) {
    const [appUsers , setAppUsers] = useState([])

    // loggedin user from redux
    const loggedUser = useSelector(store => store.user)
    const whoFollows = useSelector(store => store.follow)


    const dispatch = useDispatch()



    // fetching all users data from db

    async function fetchUsersData(){
        let fetchedUsers = []

        const userCollection = await getDocs(collection(db,'users'))

   // looping to get all users
        userCollection.forEach((doc)=>{
            fetchedUsers.push({id: doc?.id , ...doc?.data()})
        })
   setAppUsers(fetchedUsers.filter((users) => users?.id !== loggedUser?.uid))

    }

    useEffect(()=>{
        fetchUsersData()
    })


    // checking if my logged user is following my appusers

    function fetchFollowingStatus(userId){
        // console.log(userId)
        return whoFollows?.following?.some(following => following.id === userId)
    }


    useEffect(() => {
        fetchFollowingStatus()
    }, [whoFollows.following]);


    async function handleFollow(user){
        // console.log(user)
        try{
            // setting following in db firebase
            const followRef = doc(db , `users/${loggedUser.uid}/following` , user.id);
            await setDoc(followRef , {followingId: user.id , username: user.username})

            // setting followers in db
            const followerRef = await doc(db , `users/${user.id}/followers` , loggedUser.uid)
            await setDoc(followerRef , {followerId: loggedUser.uid , username: loggedUser.username})
            dispatch(addFollowing({ id: user.id, username: user.username }));
        }
        catch(e){
            alert('might be some error following ' + e )
        }


    }

    // unfollowing a user
    async function handleUnfollow(user){
        // console.log(user)
        try{
            // unfollowing users
            const unfollowRef = doc(db , `users/${loggedUser.uid}/following` , user.id)
            await deleteDoc(unfollowRef)



            // removing follower from all of the user's whom i have followed
            const unfollowerRef = doc(db, `users/${user.id}/followers`, loggedUser.uid);
            await deleteDoc(unfollowerRef);

            dispatch(removeFollowing(user.id))
        }
        catch(e){
            alert("some error unfollowing "+ e)
        }
    }




    return (
        <div className="w-[90%] md:w-[70%] lg:w-[50%] my-10 p-10 mx-auto h-auto border-4 border-black">
            <h1 className="font-bold">Follow people here</h1>

            {/*    mapping all of my users*/}

            {
                appUsers && appUsers.length > 0 && appUsers.map((user) => (
                    <div key={user.id} className="bg-white shadow-md rounded-lg p-6 mt-5 mb-5 max-w-xl mx-auto">
                        <div className="flex items-start space-x-4">
                            {/* User Profile Picture Placeholder temporary*/}
                            <div className="flex-shrink-0">
                                <img className="h-12 w-12 rounded-full"
                                     src={"https://via.placeholder.com/150"}
                                     alt={user?.username}/>
                            </div>

                            <div className="flex w-[100%] justify-between items-center">
                                <p className="text-gray-800 font-bold">{user?.username}</p>

                                {
                                    fetchFollowingStatus(user.id) ? (
                                        <button
                                            className="p-3 font-bold text-amber-50 rounded-md bg-blue-600"
                                            onClick={() => handleUnfollow(user)}
                                        >
                                            Unfollow
                                        </button>
                                    ) : (
                                        <button
                                            className="p-3 font-bold text-amber-50 rounded-md bg-red-600"
                                            onClick={() => handleFollow(user)}
                                        >Follow</button>
                                    )
                                }


                            </div>

                        </div>
                    </div>
                ))
            }

        </div>
    );
}

export default User;