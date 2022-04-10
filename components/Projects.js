import React, { Component, useEffect, useState } from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import axios from 'axios';
import moment from 'moment';
import { MDBCardGroup, MDBCard, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import Countdown from './Countdown';

export default function Projects() {
    const [modal, setModal] = useState(false);
    const [projects, setProjects] = useState([]);
    let tomorrow  = new Date();
    let startsAt = new moment(tomorrow).format('MM DD YYYY, h:mm a');
    const [nextStartTime, setNextStartTime] = useState(startsAt);

    useEffect(() => {
        getProjects();
    }, [])


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

    function generateCards(projectsList) {
        for(let i = 0; i < projectsList.length; ++i) {
            // projectsList.map((project,i) => {
                return(
                    <MDBCard key={i} className="card-body text-white" color="black" style={{ width: "22rem", marginTop: "1rem" }}>
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

    return (
        <div>
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
        </div>
    )
}