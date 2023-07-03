import './App.css';
import ColabIDE from './Components/ColabIDE';
import TopPage from './Components/TopPage';
import Explanation from './Components/Explanation';
import Message from './Components/Message';
import Getstarted from './Components/Getstarted';
import Footer from './Components/Footer';
import Lobby from './Components/Lobby';
import About from './Components/About';
import React from 'react';

import Land from './Pages/Land';
import Navbar from './Pages/Navbar';
import Aboutus from './Pages/Aboutus';
import Faq from './Pages/Faq';
import Contact from './Pages/Contact';

import { Routes, Route } from 'react-router-dom';

function Landingpage(){
  return(
    <div>
      <TopPage></TopPage>
      <Explanation></Explanation>
      <Message></Message>
      <Getstarted></Getstarted>
      <Footer></Footer>
    </div>
  )
}

function Landing(){
  return(
    <div>
      <Navbar></Navbar>
      <Land></Land>
      <Aboutus></Aboutus>
      <Faq></Faq>
      <Contact></Contact>
    </div>
  )
}

export const UserContext = React.createContext({});

function App() {
  const [username, setusername] = React.useState('');
  const [roomcreater, setroomcreater] = React.useState('');
  return (
    <>
      <UserContext.Provider value={{username, setusername, roomcreater, setroomcreater}}>
        <Routes>
          <Route path="/archive" element={<Landingpage />} />
          <Route path='/lobby' element={<Lobby/>}></Route>
          <Route path='/room/:roomid' element={<ColabIDE/>}></Route>
          <Route path='/about' element={<About></About>}></Route>
          <Route path='/' element={<Landing></Landing>}></Route>
        </Routes>
      </UserContext.Provider>
      
    </>
  );
}

export default App;
