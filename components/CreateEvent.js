import { useState } from "react";
import Router from 'next/router';
import axios from 'axios';
import { MDBContainer, MDBIcon, MDBRow, MDBCol } from "mdbreact";
import { 
    useMoralis
} from "react-moralis";
import LoadingSpinner from "./LoadingSpinner";
import bg from "../public/assets/image/bg.png";
import styles from '../styles/Create.module.css';
import Datetime from 'react-datetime';
import moment from 'moment';

const CreateEvent = () => {
    const { 
        authenticate, isAuthenticated, user, enableWeb3
    } = useMoralis();

    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [date, setDate] = useState(null);
    const [date1, setDate1] = useState(null);
    const [time, setTime] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    let yesterday = moment().subtract( 1, 'day' );
    let today = moment().subtract( 0, 'day' );
    let now = moment().subtract( 0, 'hour' );
    let valid = function( current ){
        return current.isAfter( yesterday );
    };
    let inputPropsStart = {
        placeholder: 'Start',
        style: {
            // borderColor: '#680de4 !important', 
            borderWidth:"2px",
            width: "400px"
        },
    };
    let inputPropsEnd = {
        placeholder: 'End',
        style: {
            // borderColor: '#680de4 !important', 
            borderWidth:"2px",
            width: "400px"
        },
    };
        
    async function walletConnect() {
        await authenticate({signingMessage:"Lore Sign In"});
        enableWeb3();
        try{
            let addr = user.get('ethAddress');
        } catch(e) { 
            console.error(e);
        }
        window.location.reload();
    }
    
    const handleTimeChange = (v) => {
        console.log(String(v));
        if (v) {
            setDate(v);
            console.log(v);
        }
    }
    
    const handleTimeChange1 = (v) => {
        console.log(String(v));
        if (v) {
            setDate1(v);
            console.log(v);
        }
    }
        
    const handleTimeCodeChange = (e) => {
        if (e.target.value !== null) {
            setTime(e.target.value);
        }
    }

    function handleFiles(files) {
        console.log("handleFiles");
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            uploadFile(files[i]);
        }
    }

    async function uploadFile(file) {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener("progress", (e) => {
            setProgress(Math.round((e.loaded * 100.0) / e.total));
            setErrorMessage(Math.round((e.loaded * 100.0) / e.total));
            console.log(Math.round((e.loaded * 100.0) / e.total));
        });

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                setImageUrl(response.secure_url);
                console.log(response.secure_url);
            }
        };

        fd.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );
        fd.append("tags", "browser_upload");
        fd.append("file", file);
        xhr.send(fd);
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        if (
            !e.target.eventName.value || !e.target.eventDesc.value || !date 
        ){
            const error = 'Please check that all information has been entered correctly!';
            setErrorMessage(error);
        } else {

            if (!isAuthenticated && !user ) {
                walletConnect();
            }
            
            const unix_timestamp = date.unix();
            const unix_timestamp1 = date1.unix();
            console.log(date.unix());
            setLoading(true);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: "post",
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify([
                    [
                        e.target.eventName.value, 
                        e.target.eventDesc.value,
                        e.target.eventObj.value,
                        unix_timestamp,
                        unix_timestamp1,
                        e.target.eventBudget.value,
                        0,
                        e.target.eventLink.value,
                        imageUrl,
                        user.get('ethAddress')
                    ]
                ])
            };

            fetch("https://v1.nocodeapi.com/kuzi/google_sheets/lKGduWvhRJinhnlS?tabId=Sheet1", requestOptions)
                .then(response => response.text())
                .then(result => {
                        console.log(result);
                        setLoading(false);
                        setErrorMessage("Created Project!");
                    }
                )
                .catch(error => 
                    {
                        setLoading(false);
                        // setErrorMessage(error);
                        console.log('error', error)
                    }
                );

            /*
            axios.put(
                "https://v1.nocodeapi.com/kuzi/google_sheets/lKGduWvhRJinhnlS?tabId=Sheet1", 
                JSON.stringify(
                [    
                    [
                        // 4,
                        e.target.eventName.value,
                        e.target.eventDesc.value,
                        e.target.eventObj.value,
                        unix_timestamp,
                        unix_timestamp1,
                        e.target.eventBudget.value,
                        0,
                        e.target.eventLink.value,
                        imageUrl,
                        // user.get('ethAddress')
                    ]
                ]),
                    // JSON.stringify(
                    //     [
                    //         [
                    //             3,
                    //             e.target.eventName.value,
                    //             e.target.eventDesc.value,
                    //             e.target.eventObj.value,
                    //             unix_timestamp,
                    //             unix_timestamp1,
                    //             e.target.eventBudget.value,
                    //             0,
                    //             e.target.eventLink.value,
                    //             imageUrl,
                    //             user.get('ethAddress')
                    //         ]
                    //     ]
                    // ),
                {
                    params: {
                        tabId: "Sheet1"
                    }
                },
                {headers: { 'content-type': 'application/json' }},
            )
            .then(result => {
                console.log(result);
                setLoading(false);
                setErrorMessage(result.data.message);
            })
            .catch(error => {
                setLoading(false);
                // setErrorMessage(error);
                console.log(error);
            });*/
        }
    }
    
    return (
        <MDBContainer 
            style={{
                width: "100vw !important",
                height:"800px", position:"relative", margin: "auto",
                backgroundImage: "url("+ bg +")"
            }}
        >            
            <div 
                style={{
                    position: "absolute",
                    top:"50%", left:"50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                
                <form className="signUpForm" onSubmit={handleSubmit}
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                        <h2 style={{color:"#000"}} className="text-center"><b>Create Project</b></h2>
                        <input 
                            className="form-control"
                            id="eventName" 
                            type="text"
                            placeholder="Name" 
                            style={{
                                backgroundColor: "transparent",
                                // borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="eventDesc" 
                            type="text"
                            placeholder="Description" 
                            style={{
                                backgroundColor: "transparent",
                                // borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="eventBudget" 
                            type="text"
                            placeholder="Budget" 
                            style={{
                                backgroundColor: "transparent",
                                // borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="eventLink" 
                            type="text"
                            placeholder="External Link" 
                            style={{
                                backgroundColor: "transparent",
                                // borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                        />
                        <br/>

                        <textarea 
                            className="form-control"
                            id="eventObj" 
                            type="text"
                            placeholder="Objectives" 
                            style={{
                                backgroundColor: "transparent",
                                // borderColor: "#680de4", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            // onChange={handlePasswordChange}
                            required
                        />
                        <br/>

                        <Datetime  
                            isValidDate={valid} 
                            input={true} 
                            inputProps={inputPropsStart} 
                            onChange={handleTimeChange}
                            onClose={handleTimeChange}
                        />
                        <br/>

                        <Datetime  
                            isValidDate={valid} 
                            input={true} 
                            inputProps={inputPropsEnd} 
                            onChange={handleTimeChange1}
                            onClose={handleTimeChange1}
                        />
                        <br/>

                        <div className="">
                            <div className="">
                                <input 
                                    className="" 
                                    onChange={(e) => handleFiles(e.target.files)}  
                                    style={{width:"400px"}}
                                    type="file" 
                                    name="chooseFile" 
                                    id="chooseFile"  
                                />
                            </div>
                        </div>
                        <br/>
                        
                        {
                            loading
                            ?
                                <LoadingSpinner/>
                            :
                                <button 
                                    className="btn rounded text-white" 
                                    style={{
                                        backgroundColor: "#000000", width:"400px", margin:"0px"
                                    }}
                                    disabled={disabledSubmit}
                                >
                                    <b>Create Project</b>
                                </button>
                        }
 
                        <br/>
                        <p style={{color:"#000000", maxWidth: "400px"}}>{errorMessage}</p>
                </form>
            </div>
        </MDBContainer>
    )
}

export default CreateEvent;