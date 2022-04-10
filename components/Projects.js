import React, { Component, useEffect, useState } from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import axios from 'axios';
import moment from 'moment';
import { MDBCardGroup, MDBCard, MDBCardTitle, MDBCardText, MDBContainer, MDBCollapse, MDBIcon, MDBRow, MDBCol } from "mdbreact";
import Countdown from './Countdown';
import SectionContainer from './SectionContainer';
import { 
    useMoralis, useMoralisFile, useWeb3Transfer
} from "react-moralis";

export default function Projects() {
    const [modal, setModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [viewProjectInfo, setViewProjectInfo] = useState(false);
    const [viewing, setViewing] = useState({});
    let tomorrow  = new Date();
    let startsAt = new moment(tomorrow).format('MM DD YYYY, h:mm a');
    const [nextStartTime, setNextStartTime] = useState(startsAt);
    const [toggleId, setToggleId] = useState("accordion1");
    const { 
      Moralis
    } = useMoralis();
    const { saveFile, moralisFile } = useMoralisFile();
    const { fetch: paymentProcessor, error, isFetching } = useWeb3Transfer();

    useEffect(() => {
        getProjects();
    }, [])

    async function pay(){       
        const price = 8;
        const paymentParams = {
                type: "native",
                amount: Moralis.Units.ETH(price),
                receiver: "0xD15BE984F5e58358b905B19e8fdAFced86954970",
            };
        
        await paymentProcessor({
            params: paymentParams,
            onSuccess: async (response) => {alert("Payment Successful!");},
        });
    }
    
    function toggleCollapse(id) {
        let collapseID = "";
        if (id !== toggleId) {
            collapseID = id;
        }
        setToggleId(collapseID);
    }

    function getProjects() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: "get",
            headers: myHeaders,
            redirect: "follow",
            
        };

        fetch("https://v1.nocodeapi.com/kuzi/google_sheets/lKGduWvhRJinhnlS?tabId=Sheet1", requestOptions)
            .then(response => response.text())
            .then(result => {
                    console.log(JSON.parse(result).data);
                    setProjects(JSON.parse(result).data);
                })
            .catch(error => console.log('error', error));
    }

    function openProject(proj) {
        setViewing(proj);
        setViewProjectInfo(true);
    }

    function closeProject() {
        setViewing({});
        setViewProjectInfo(false);
    }

    function generateCards(projectsList) {
        for(let i = 0; i < projectsList.length; ++i) {
            // projectsList.map((project,i) => {
                return(
                    <MDBCard key={i} onClick={()=>{openProject(projectsList[i])}} className="card-body text-white" color="black" style={{ width: "22rem", marginTop: "1rem" }}>
                        <MDBRow>
                            <MDBCol md="8">
                                <MDBCardTitle>{projectsList[i].Name}</MDBCardTitle>
                                <MDBCardText>
                                    {projectsList[i].Description}
                                </MDBCardText>
                                <div className="flex-row">
                                    <a href={projectsList[i].ExternalLink}>Project link</a>
                                    <a href={projectsList[i].ExternalLink} style={{ marginLeft: "1.25rem" }}>Socials</a>
                                </div>
                            </MDBCol>
                            <MDBCol md="3">
                                <img src={projectsList[i].ImageUrl} className="" height="150px" width="90px" alt="" />
                            </MDBCol>
                        </MDBRow>
                    </MDBCard>
                );
            }// });
    }

    function ViewProject() {
        return (
            <MDBContainer style={{paddingTop:"11em"}}>
                <h1 className="text-center">{viewing.Name} <MDBIcon far icon="times-circle" onClick={()=>{closeProject()}}/></h1>    
                <div className=''>
                    <MDBCard className="card-body text-white" color="black" style={{ maxWidth: "30rem", marginTop: "1rem" }}>
                        <MDBRow>
                            <MDBCol md="8">
                                <MDBCardTitle>{viewing.Name}</MDBCardTitle>
                                <MDBCardText>
                                    {viewing.Description}
                                </MDBCardText>
                                <div className="flex-row">
                                    <a href={viewing.ExternalLink}>Project link</a>
                                    <a href={viewing.ExternalLink} style={{ marginLeft: "1.25rem" }}>Socials</a>
                                </div>
                            </MDBCol>
                            <MDBCol md="3">
                                <img src={viewing.ImageUrl} className="" height="150px" width="90px" alt="" />
                            </MDBCol>
                        </MDBRow>
                    </MDBCard>
                </div>
                <SectionContainer noBorder={true}>
                    <h2>&nbsp;<MDBIcon style={{color:"#000000"}} icon="map" /> Milestones </h2>
                    <div>
                        <div>
                            <button
                                className="btn btn-black rounded"
                                color="#ef7424"
                                onClick={() => {toggleCollapse('accordion1')}}
                                style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                            >
                                Get rights to Voltron Intellectual Property
                            </button>
                        </div>
                        <MDBCollapse id='accordion1' isOpen={toggleId}>
                            <MDBContainer
                                style={{}}
                            >
                                <MDBRow>
                                    <MDBCol
                                        size='6'
                                    >
                                        <p>Get rights to Voltron Intellectual Property</p>
                                        <p>
                                            Buy or negotiate rights to use the Voltron I.P.
                                        </p>
                                        <p>Status: In Progress</p>
                                    </MDBCol>
                                    <MDBCol size='6'
                                        className='d-flex justify-content-center align-items-center'
                                    >
                                        <button
                                            className="btn btn-black rounded"
                                            color="#ef7424"
                                            onClick={() => {pay()}}
                                            style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                                        >
                                            Fund
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "25%", backgroundColor:"#ef7424"}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                            </MDBContainer>
                        </MDBCollapse>

                        <div>
                            <button
                                className="btn btn-black rounded"
                                onClick={() => {toggleCollapse('accordion2')}}
                                style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                            >
                                Community management tools
                            </button>
                        </div>
                        <MDBCollapse id='accordion2' isOpen={toggleId}>
                            <MDBContainer
                                style={{position: "reative"}}
                            >
                                <MDBRow>
                                    <MDBCol
                                        size='6'
                                    >
                                        <p>Tools to help Creators to interact with their Collectors</p>
                                        <p>
                                            Build tools to help Creators to interact with their NFT Collectors like offering more exclusive content, sneak peaks, whitelisting, air drops and updates etc. 
                                            And allow Collectors to interact with the Creators they support.
                                        </p>
                                        <p>Status: Coming Soon</p>
                                    </MDBCol>
                                    <MDBCol size='6'
                                        className='d-flex justify-content-center align-items-center'
                                    >
                                        <button
                                            className="btn btn-black rounded"
                                            color="#ef7424"
                                            onClick={() => {toggleCollapse('accordion1')}}
                                            style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                                            disabled
                                        >
                                            Fund
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "0%", backgroundColor:"#ef7424"}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                            </MDBContainer>
                        </MDBCollapse>

                        <div>
                            <button
                                className="btn black rounded"
                                onClick={() => {toggleCollapse('accordion3')}}
                                style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                            >
                                Distributed Storage for content
                            </button>
                        </div>
                        <MDBCollapse id='accordion3' isOpen={toggleId}>
                            <MDBContainer
                                style={{position: "reative"}}
                            >
                                <MDBRow>
                                    <MDBCol
                                        size='6'
                                    >
                                        <p>Distributed Storage tools for limited and exclusive content</p>
                                        <p>
                                            Create tools to help Creators upload and manage their limited access content securely.
                                            And better ensure that whenever a Collector buys an NFT the associated content will be available to them for all time in perpertuity.  
                                        </p>
                                        <p>Status: Coming Soon</p>
                                    </MDBCol>
                                    <MDBCol size='6'
                                        className='d-flex justify-content-center align-items-center'
                                    >
                                        <button
                                            className="btn btn-black rounded"
                                            color="#ef7424"
                                            onClick={() => {toggleCollapse('accordion1')}}
                                            style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                                            disabled
                                        >
                                            Fund
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "0%", backgroundColor:"#ef7424"}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                            </MDBContainer>
                        </MDBCollapse>
                        
                        <div>
                            <button
                                className="btn black rounded"
                                onClick={() => {toggleCollapse('accordion4')}}
                                style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                            >
                                Dedicated Marketplace
                            </button>
                        </div>
                        <MDBCollapse id='accordion4' isOpen={toggleId}>
                            <MDBContainer
                                style={{position: "reative"}}
                            >
                                <MDBRow>
                                    <MDBCol
                                        size='6'
                                    >
                                        <p>Dedicated Marketplace for Mint Condition NFTs</p>
                                        <p>
                                            Build out a markerplace where we can showcase and celebrate all the Creators, creating on Mint Condition. 
                                            Expose Collectors to all of the amazing NFTs minted on Mint Condition.
                                        </p>
                                        <p>Status: Coming Soon</p>
                                    </MDBCol>
                                    <MDBCol size='6'
                                        className='d-flex justify-content-center align-items-center'
                                    >
                                        <button
                                            className="btn btn-black rounded"
                                            color="#ef7424"
                                            onClick={() => {toggleCollapse('accordion1')}}
                                            style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                                            disabled
                                        >
                                            Fund
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "0%", backgroundColor:"#ef7424"}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                            </MDBContainer>
                        </MDBCollapse>
                        
                        <div>
                            <button
                                className="btn black rounded"
                                onClick={() => {toggleCollapse('accordion5')}}
                                style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                            >
                                Token For Creator and Collector Programs
                            </button>
                        </div>
                        <MDBCollapse id='accordion5' isOpen={toggleId}>
                            <MDBContainer
                                style={{position: "reative"}}
                            >
                                <MDBRow>
                                    <MDBCol
                                        size='6'
                                    >
                                        <p>Mint Tokens</p>
                                        <p>
                                            We plan to Mint a token to be used on the platform and for Creator and Collector rewards programs. 
                                        </p>
                                        <p>Status: Coming Soon</p>
                                    </MDBCol>
                                    <MDBCol size='6'
                                        className='d-flex justify-content-center align-items-center'
                                    >
                                        <button
                                            className="btn btn-black rounded"
                                            color="#ef7424"
                                            onClick={() => {toggleCollapse('accordion1')}}
                                            style={{ marginBottom: '1rem', width:"320px", color:"#ef7424" }}
                                            disabled
                                        >
                                            Fund
                                        </button>
                                    </MDBCol>
                                </MDBRow>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "0%", backgroundColor:"#ef7424"}} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                            </MDBContainer>
                        </MDBCollapse>
                    </div>
                </SectionContainer>
            </MDBContainer>
        );
    }

    return (
        <div>
            {
                viewProjectInfo
                ?
                    ViewProject()
                :
                    <header>
                        <div className="view" style={{maxHeight:"100vh", paddingTop: "10em"}}>
                            <MDBContainer>
                                <MDBCardGroup column>
                                    {
                                        projects 
                                        &&
                                        generateCards(projects)
                                    }
                                </MDBCardGroup>
                            </MDBContainer>
                        </div>
                    </header>
            }
        </div>
    )
}