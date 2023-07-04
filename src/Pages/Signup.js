import React, {useState, useContext} from 'react'
import LSimg from '../Images/LSimg.png'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

export default function Signup() {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [redirect, setredirect] = useState(false);
  const {userinformation, setuserinformation} = useContext(UserContext);

  async function signup(){
    const response = await fetch(`${process.env.REACT_APP_APIPORT}/signup`, {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-type':'application/json'},
    })
    if(response.ok){
      setredirect(true);
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
                  <button onClick={signup}>Sign Up</button>
              </div>
              <img src={LSimg} alt='login/signup img'></img>
          </div>
      </div>
  )
}
