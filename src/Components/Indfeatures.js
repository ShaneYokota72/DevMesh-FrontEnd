import React, {useEffect, useState} from 'react'

export default function Indfeatures(props) {
    const [opcaity, setOpcaity] = useState('mainfeature');

    useEffect(() => {
        if(props.opcaity) {
            setOpcaity('featureinvisible');
        }
    }, [props.opcaity])

    return (
        <div className='indfeatures' id={opcaity}>
            <p className='featureicon'>{props.icon}</p>
            <h2 className='featuredesc' >{props.desc}</h2>
            <p className='featuredesc2'>{props.desc2}</p>
        </div>
    )
}
