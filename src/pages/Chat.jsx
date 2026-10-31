import React, { useContext } from 'react'
import { dataContext, prevUser } from '../context/UserContext'

export const Chat = () => {
    let { input, setInput, prevInput, setPrevInput, showResult, setShowResult, feature, setFeature, prevFeature,setPrevFeature,genImgUrl,setGenImgUrl } = useContext(dataContext)
    return (
        <div className='chat-page'>
            <div className="user">

                {prevFeature == "upimg" ? <><img src={prevUser.imgUrl} alt="" />
                    <span>{prevInput}</span></> : <span>{prevInput}</span>}

            </div>
            <div className="ai">
                {prevFeature == "genimg" ? <> 
                    {!genImgUrl ? <span>Generate Image...</span> : <img src={genImgUrl} alt="" />}</> : !showResult ? <span>Loading...</span> : <span>{showResult}</span>}
            </div>
        </div>
    )
}
