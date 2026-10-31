import React, { useContext } from 'react'
import '../App.css'
import { RiImageAiLine } from "react-icons/ri";
import { RiImageUploadLine } from "react-icons/ri";
import { CiChat1 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaArrowUpLong } from "react-icons/fa6";
import { dataContext, prevUser, user } from '../context/UserContext';
import { Chat } from './Chat';
import { generateResponse } from '../gemini';
import { query } from '../huggingface';

export const Home = () => {
    let { startRes, setStartRes, popUp, setPopUp, input, setInput,feature,setFeature,showResult,setShowResult ,prevFeature,setPrevFeature,prevInput, setPrevInput,genImgUrl,setGenImgUrl,selectedImg, setSelectedImg} = useContext(dataContext)
    async function handleSubmit(e) {

        setStartRes(true)
        setPrevFeature(feature)
        setShowResult("")
       prevUser.data=user.data;
       prevUser.mime_type=user.mime_type;
       prevUser.imgUrl=user.imgUrl;
       prevUser.prompt=input;
         user.data=null
            user.mime_type=null
            user.imgUrl=null
             setSelectedImg(null)
      setPrevInput(input)
        setInput("");
       let result=await generateResponse()
      setShowResult(result)
       setFeature("chat")
    
    }

    function handleImage(e){
        setFeature("upimg")
        let file=e.target.files[0]

        let reader=new FileReader()
        reader.onload=(event)=>{
            let base64=event.target.result.split(",")[1]
            user.data=base64
            user.mime_type=file.type
            user.imgUrl=`data:${user.mime_type};base64,${user.data}`

            setSelectedImg(user.imgUrl)
        }
        reader.readAsDataURL(file)
    }

    
async function handleGenerateImg() {
    setStartRes(true)
    setPrevFeature(feature)
    setGenImgUrl("")

    prevUser.prompt = input
    setPrevInput(input)
    setInput("")

    try {
        let result = await query()
        setGenImgUrl(result)
        setFeature("chat")
    } catch (error) {
        console.error("Image generation error:", error)
        alert(error.message || "Image generation failed")
        setStartRes(false)
        setFeature("genimg")
    }
}

    return (
        <div className='home'>
            <nav>
                <div className="logo" onClick={()=>{
                    setStartRes(false)
                    setFeature("chat")
                      user.data=null
            user.mime_type=null
            user.imgUrl=null
            setPopUp(false)
                }}>
                    Smart AI Bot
                </div>
            </nav>

       <input type="file" accept='image/*' hidden id='inputImg' onChange={handleImage}/>
            {!startRes ? <div className="hero">
                <span id='tag'>What can I help with ?</span>
                <div className="cate">
                    <div className="upImg" onClick={()=>{
                        document.getElementById("inputImg").click()
                    }}>
                        <RiImageUploadLine />
                        <span>Upload Image</span>
                    </div>
                    <div className="genImg" onClick={()=>setFeature("genimg")}>
                        <RiImageAiLine />
                        <span>Generate Image</span>
                    </div>
                    <div className="chat" onClick={()=>setFeature("chat")}>
                        <CiChat1 />
                        <span>Let's Chat</span>
                    </div>
                </div>
            </div>
                :
                <Chat />
            }


           
            <form className="input-box" onSubmit={(e) => {
                e.preventDefault()
                if (input) {
                    if(feature=="genimg"){
                        handleGenerateImg()
                    }
                    else{
                     handleSubmit(e)
                    }
                  
                }
            }}>

               {selectedImg && (
    <img src={selectedImg} alt="Selected image" id='im' />
)}
                {popUp ? <div className="pop-up">
                    <div className="select-up" onClick={()=>{
                        setPopUp(false)
                        setFeature("chat")
                        document.getElementById("inputImg").click()
                    }}>
                        <RiImageUploadLine />
                        <span>Upload Image</span>
                    </div>
                    <div className="select-gen" onClick={()=>{
                         setPopUp(false)
                        setFeature("genimg")}}>
                        <RiImageAiLine />
                        <span>Generate Image</span>
                    </div>
                </div> : null}

                <div id="add" onClick={() => {
                    setPopUp(prev => !prev)
                }}>
                    {feature=="genimg"? <RiImageAiLine id="genimg" />: <FaPlus />}
                </div>
                <input type="text" placeholder='Ask Something...' onChange={(e) => setInput(e.target.value)} value={input} />
                {input ? <button id="submit">
                    <FaArrowUpLong />
                </button> : null}

            </form>
        </div>
    )
}
