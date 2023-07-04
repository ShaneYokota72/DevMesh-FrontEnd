import React, {useState} from 'react'
import Searchres from './Searchres';


export default function Lobbybody() {
    const [keyword, setkeyword] = useState('');
    const [searchres, setsearchres] = useState([]);

    async function refreshsearchres(){
        console.log('refreshing', keyword);
        const responce = await fetch(`${process.env.REACT_APP_APIPORT}/search`, {
            method: 'POST',
            body: JSON.stringify({keyword: keyword}),
            headers: {'Content-type':'application/json'},
        });
        if(responce.ok){
            responce.json().then(data => {
                // console.log(data);
                setsearchres(data);
            })
        }
    }  
    return (
        <div className='lobbybody'>
            <div className='search'>
                <input type='text' placeholder='room description' className='searchbar' value={keyword} onChange={ev=>setkeyword(ev.target.value)}/>
                <svg className='searchbutton' onClick={refreshsearchres} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </div>
            <div className='resulttext'>
                <h2>Search Result</h2>
                <span>38</span>
            </div>
            <div className='searchresult'>
                <Searchres></Searchres>
                <Searchres></Searchres>
                <Searchres></Searchres>
                <Searchres></Searchres>
            </div>
        </div>
    )
}
