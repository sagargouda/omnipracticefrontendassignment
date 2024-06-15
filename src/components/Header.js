import React, { useState} from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { signOut} from "firebase/auth";
import {auth} from "../utils/firebase";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import { removeUser} from "../redux/userSlice";
import {logout} from "../redux/followSlice";



function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate()
//  for dispatching an action
    const dispatch = useDispatch()

    const selector  = useSelector(store => store.user)
    const followSelector = useSelector(store => store.follow)


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // signing out
    function handleSignOut(){
        signOut(auth).then(() => {
            // if sign out is successful navigate to "/"
            navigate('/')
            dispatch(removeUser())
          dispatch(logout())
        }).catch((error) => {
            // if error happens pass it to navigate('*') which is an error page
            navigate('*')
        });
    }


    function handleBackdrop(e){
        if(e.target == e.currentTarget){
            setMenuOpen(false)
        }
    }




    return (
        <div className="w-full bg-[#fdfbf5] shadow-2xl h-16 flex items-center justify-between px-6 md:px-48 border-b border-black">
            <h1 className="text-xl md:text-2xl font-bold">Omnitweets</h1>
            {
                selector?.uid && (<>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to={"/app/feed"}> <span className=" cursor-pointer text-md md:text-lg">Feed</span></Link>
                        <Link to="/app/user"><span className="cursor-pointer text-md md:text-lg">Users</span></Link>
                        <Link to={"/app/profile"}><span className="cursor-pointer text-md md:text-lg">Profile</span></Link>
                        <span onClick={handleSignOut} className="text-lg cursor-pointer">Sign out</span>
                    </div>
                    <div className="md:hidden">

                        <GiHamburgerMenu size={25} className={"cursor-pointer"} onClick={toggleMenu}/>

                    </div>
                </>)
            }
            {menuOpen && (
                <div onClick={handleBackdrop}
                     className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center  md:hidden">
                    <div
                        className=" w-64 flex  flex-col justify-between items-center  bg-white space-y-4 h-[250px] p-4 shadow-2xl">
                        <IoMdClose size={25} className="cursor-pointer" onClick={toggleMenu}/>
                        <nav className="flex flex-col space-y-4">
                            <Link to={"/app/feed"}> <span className=" cursor-pointer text-lg">Feed</span></Link>
                            <Link to="/app/user"><span className="cursor-pointer text-lg">Users</span></Link>
                            <Link to={"/app/profile"}><span className="cursor-pointer text-lg">Profile</span></Link>
                            {
                                selector?.uid && <span onClick={handleSignOut} className="text-lg">Sign out</span>
                            }

                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
