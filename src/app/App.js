import React, {useContext, useEffect} from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/login/Login";
import Layout from "../shared/Layout";
import {GunContext} from "../gun/GunProvider";
import { useNavigate } from "react-router-dom";
import Dashboard from '../modules/dashboard/Dashboard';
import Profile from '../modules/profile/Profile';
import Users from '../modules/users/Users';
import MyRequests from '../modules/myRequests/MyRequests';
import FriendRequests from '../modules/friendRequests/FriendRequests';
import ProtectedRoute from '../auth/ProtectedRoute';
import Friends from '../modules/Friends/Friends';
import Chats from '../modules/chats/Chats';
import Chat from '../modules/chat/Chat';

function App() {

  const gunContext = useContext(GunContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!gunContext.user.is){
        navigate('/login')
    }
  },[gunContext])

  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route 
            path="/"
            element={<Navigate to="/dashboard" replace={true} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/friend-requests" element={<ProtectedRoute><FriendRequests /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
