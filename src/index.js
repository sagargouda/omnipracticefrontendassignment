import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter , RouterProvider} from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import User from "./pages/User";
import Profile from "./pages/Profile";
import {Provider} from "react-redux";
import {appStore} from "./redux/appStore";


const appRouter = createBrowserRouter(
    [
        {
            path: '/',
            element: <Login/>
        },
        {
            path: '*',
            element: <Error/>
        },
        {
            path: '/app',
            element: <App/>,
            children: [
                {
                    path: '/app/feed',
                    element: <Feed/>
                },
                {
                    path: '/app/user',
                    element: <User/>
                },
                {
                    path: '/app/profile',
                    element: <Profile/>
                }
            ]
        }
    ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={appStore}>
        <RouterProvider router={appRouter}/>
    </Provider>


);



