import React, {useState} from 'react'
import LSimg from '../Images/LSimg.png'
import { Link, Navigate } from 'react-router-dom';

export default function Signup() {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [displayname, setdisplayname] = useState('');
  const [redirect, setredirect] = useState(false);

  async function signup(){
    const response = await fetch(`${process.env.REACT_APP_APIPORT}/signup`, {
      method: 'POST',
      body: JSON.stringify({username, password, displayname}),
      headers: {'Content-type':'application/json'},
    })
    if(response.ok){
      setredirect(true);
    } else {
      alert("Please Try Again");
    }
  }

  if(redirect){
    return <Navigate to='/login'></Navigate>
  }

  return (
      <div className='LSbg'>
          <div className='LSform'>
              <div className='LSleft'>
                  <h2>Sign Up</h2>
                  <span>Username:</span>
                  <input placeholder='username' type='text' value={username} onChange={e => setusername(e.target.value)}/>
                  <span>Password:</span>
                  <input placeholder='password' type='password' value={password} onChange={e=> setpassword(e.target.value)}/>
                  <span>Display Name:</span>
                  <input placeholder='Adam Smith' type='text' value={displayname} onChange={e=> setdisplayname(e.target.value)}/>
                  <button onClick={signup}>Sign Up</button>
                  <h5>Already have an account? <Link to='/login'>Log In</Link></h5>
              </div>
              <img src={LSimg} alt='login/signup img'></img>
          </div>
      </div>
  )
}
