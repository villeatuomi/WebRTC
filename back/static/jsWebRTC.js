// FUNCTION --- This function console logs the text and the time it took to get this point.
const trace = text => {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now, text);
};
let localStream;

const confi = {
    iceServers: [{
        urls: "turn:numb.viagenie.ca",
        credential: "thisisformysafety",
        username: "ville.tuomi2@metropolia.fi"
    }, {
        urls: "stun:numb.viagenie.ca",
        credential: "thisisformysafety",
        username: "ville.tuomi2@metropolia.fi"
    }, { urls: ["stun:stun.l.google.com:19302"] }, { urls: "turn:10.114.32.27:2222", credential: "thisisformysafety", username: "webrtc" }]
};

/*
const confi = {
    iceServers: [{ 'urls': 'stun:stun.l.google.com:19302' }, {
        urls: 'turn:numb.viagenie.ca:3478',
        credential: 'thisisformysafety',
        username: 'ville.tuomi2@metropolia.fi'
    }]
};*/

let localPeer = new RTCPeerConnection(confi);
let remotePeer = new RTCPeerConnection(confi);
let kutsuja;
let kutsuttava;
console.log(`Start of script - Kutsuja: ${kutsuja}; Kutsuttava: ${kutsuttava}`);

// Start the camera for preview window.
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
    document.getElementById("selfview").srcObject = stream;
}).catch(err => console.log(err));

//trace('Seuraavaksi console log socket.');
/*{
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302' // Lisätty tämä objekti ja nyt rivin 37 (onicecandidateHandlerFunc) console log näytää ICE Candidateja.
    }]
}*/

//trace('RTCPeerConnection initialized!');

// FUNCTION --- This function starts the nego
const startNegotiation = (receiver, socket) => {
    console.log(`KUTSUJA ON: ${socket.id}`);
    console.log(`KUTSUTTAVA ON: ${receiver}`);
    kutsuja = socket.id;
    kutsuttava = receiver;
    console.log(`startNegotiation - Kutsuja: ${kutsuja}; Kutsuttava: ${kutsuttava}`);

    //Get local audio/video feed and show it in selfview video element
    trace('Seuraavaksi alkaa getUserMedia');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
        //document.getElementById("selfview").srcObject = stream;
        trace('Seuraavaksi aktivoituu addStream-event');
        localStream = stream;
        localPeer.addStream(stream);
        /*
                    stream.getTracks().forEach(track => {
                        localPeer.addTrack(track, stream); // This returns a RTCRtpSender object
                        //console.log(pc.getLocalStreams()); // 191007klo1120 This returns the mediastreams which is connected pc.
                    });*/
        //caller.addStream(stream);
        //__

        let messageObj = {};
        //Initializing a peer connection
        localPeer.createOffer().then(offer => {
            localPeer.setLocalDescription(new RTCSessionDescription(offer));
            messageObj.sender = socket.id;
            messageObj.receiver = receiver;
            messageObj.sdp = offer;
            socket.emit("sdpToRemote", receiver, JSON.stringify(messageObj));
        });
        //__
    }).catch(evt => {
        console.log("Error occurred!", evt);
    });

    /*let messageObj = {};
    //Initializing a peer connection

    localPeer.createOffer().then(offer => {
        console.log('offer: ', offer);

        localPeer.setLocalDescription(new RTCSessionDescription(offer));
        console.log('LocalPeer on: ', localPeer);
        messageObj.sender = socket.id;
        messageObj.receiver = receiver;
        messageObj.sdp = localPeer.localDescription;
        socket.emit("sdp", JSON.stringify({ "sdp": offer }));
        //socket.emit('sendOffer', receiver, JSON.stringify(messageObj));
    });*/
};

// FUNCTION --- Send the ICE Candidate to the remote peer - Tätä funktiota kutsutaan alla olevassa funktiossa.
const onIceCandidate = (peer, evt) => {
    if (evt.candidate) {
        trace('Seuraavaksi kandidaatti lähetetään socket.io serverille.');
        //socket.emit("candidate", JSON.stringify({ "candidate": evt.candidate }));
        socket.emit("candiToRemote", peer, JSON.stringify({ "candidate": evt.candidate }));
    }
};

const remoonIceCandidate = (peer, evt) => {
    if (evt.candidate) {
        trace('Seuraavaksi kandidaatti lähetetään socket.io serverille.');
        //socket.emit("candidate", JSON.stringify({ "candidate": evt.candidate }));
        socket.emit("candiToLocal", peer, JSON.stringify({ "candidate": evt.candidate }));
    }
};

// HANDLERFUNCTION --- Listen for ICE Candidates and send them to remote peers
const onicecandidateHandlerFunc = evt => {
    if (!evt.candidate) return;
    console.log("Icecandidate löydetty!!!");
    //console.log("onicecandidate called");
    console.log('Löydetty candidate on: ', evt); // Kun RTCPeerConnectionissa (~ rivi 11) on alustusobjekti, niin konsoliin tulee candidate-objekteja.
    trace('Seuraavaksi kutsutaan onIceCandidate-funktiota.');
    onIceCandidate(kutsuttava, evt); // Kutsutaan funktiota onIceCandidate riviltä ~25.
};

const remoteonicecandidateHandlerFunc = evt => {
    if (!evt.candidate) return;
    console.log("Icecandidate löydetty REMOTELLE!!!");
    //console.log("onicecandidate called");
    console.log('Löydetty candidate on: ', evt); // Kun RTCPeerConnectionissa (~ rivi 11) on alustusobjekti, niin konsoliin tulee candidate-objekteja.
    trace('Seuraavaksi kutsutaan onIceCandidate-funktiota.');
    remoonIceCandidate(kutsuja, evt); // Kutsutaan funktiota onIceCandidate riviltä ~25.

};

//onaddstream handler to receive remote feed and show in remoteview video element
const onaddstreamHandlerFunc = evt => {
    console.log("onaddstream called");
    trace('Seuraavaksi lisätään striimi remoteview nimiseen elementiin.');
    document.getElementById("video1").srcObject = evt.stream;
};


const remoteonaddstreamHandlerFunc = evt => {
    console.log("remoteonaddstream called");
    trace('Seuraavaksi lisätään striimi XXXXXX nimiseen elementiin.');
    document.getElementById("video1").srcObject = evt.stream;
};

/*
//Get local audio/video feed and show it in selfview video element
trace('Seuraavaksi alkaa getUserMedia');
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
    document.getElementById("selfview").srcObject = stream;
    trace('Seuraavaksi aktivoituu addStream-event');
    localStream = stream;
    localPeer.addStream(stream);
/*
    stream.getTracks().forEach(track => {
        localPeer.addTrack(track, stream); // This returns a RTCRtpSender object
        //console.log(pc.getLocalStreams()); // 191007klo1120 This returns the mediastreams which is connected pc.
    });
    //caller.addStream(stream);
}).catch(evt => {
    console.log("Error occurred!", evt);
});*/


/*
//Create and send offer to remote peer on button click
document.getElementById("makeCall").addEventListener("click", () => {
    //Get local audio/video feed and show it in selfview video element
    trace('Seuraavaksi alkaa getUserMedia');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
        document.getElementById("selfview").srcObject = stream;
        trace('Seuraavaksi aktivoituu addStream-event');
        localStream = stream;
        localPeer.addStream(stream);
        //__
        let messageObj = {};
        //Initializing a peer connection
        localPeer.createOffer().then(offer => {
            console.log('offer: ', offer);
            localPeer.setLocalDescription(new RTCSessionDescription(offer));
            console.log('LocalPeer on: ', localPeer);
            //messageObj.sender = socket.id;
            //messageObj.receiver = receiver;
            //messageObj.sdp = localPeer.localDescription;
            socket.emit("sdp", JSON.stringify({ "sdp": offer }));
        });
        //__
        /*
            stream.getTracks().forEach(track => {
                localPeer.addTrack(track, stream); // This returns a RTCRtpSender object
                //console.log(pc.getLocalStreams()); // 191007klo1120 This returns the mediastreams which is connected pc.
            });
        //caller.addStream(stream);
    }).catch(evt => {
        console.log("Error occurred!", evt);
    });
    /*  
      trace('Soittonappia painettiin!');
      caller.createOffer().then(desc => {
          trace('Offeri tehty');
          caller.setLocalDescription(new RTCSessionDescription(desc));
          trace('SetLocalDescription asetettu ja nyt seuraavaksi lähetetään sdp-tietoja socket.io palvelimelle.');
          socket.emit("sdp", JSON.stringify({ "sdp": desc }));
      });  
});*/


/*
const trackHandlerFunc = (e) => {
    console.log('!#¤%&/?!#¤%&?');
};*/

//caller.addEventListener('addstream', onaddstreamHandlerFunc);
//caller.addEventListener('icecandidate', onicecandidateHandlerFunc);
//caller.addEventListener('track', trackHandlerFunc);// test

localPeer.addEventListener('negotiationneeded', (e) => { console.log('&&&&&&&&&&&&&&&& MOI MOI MOI') });
localPeer.addEventListener('addstream', onaddstreamHandlerFunc);
//localPeer.addEventListener('track', onaddstreamHandlerFunc);
localPeer.addEventListener('icecandidate', onicecandidateHandlerFunc);
//localPeer.addEventListener('track', trackHandlerFunc);// test

remotePeer.addEventListener('negotiationneeded', (e) => { console.log('&&&&&&&&&&&&&&&& TERE TERE TERE') });
remotePeer.addEventListener('addstream', remoteonaddstreamHandlerFunc);
remotePeer.addEventListener('icecandidate', remoteonicecandidateHandlerFunc);


//###################################### SOCKET.IO ##############################################################
//Communications with the remote peer through signaling server
socket.on("connect", client => {
    //Connection established with the signaling server
    console.log(`Connected to Socket.io! Your ID is: ${socket.id}.`);
});

socket.on('offerForClients', arr => {
    console.log('Server sent this array', arr);
    arr.forEach(element => {
        console.log('element forEachin sisällä', element);
        if (element !== socket.id) {
            console.log('Päästäänkö Iffin sisälle?? Element:', element);
            startNegotiation(element, socket); // Starts startNegotiation-function, go to line ~20
        }
    });
});
/*
socket.on('offerFromUser', msg => {
    console.log('msg: ', msg);
    const parsedMsg = JSON.parse(msg);
    console.log(`${parsedMsg.sender} sent a message to you: `, parsedMsg);
    remotePeer.setRemoteDescription(parsedMsg.sdp).then(rem => console.log('remotePeer on: ', remotePeer));
    remotePeer.createAnswer().then(sdp => {
        trace('Vastaus luotu');
        remotePeer.setLocalDescription(new RTCSessionDescription(sdp));
        socket.emit("answer", JSON.stringify({ "sdp": sdp }));
    });
});*/

//Listening for the candidate message from a peer sent from onicecandidate handler
socket.on("candidate", msg => {
    console.log("candidate received");
    trace('Seuraavaksi lisätään saapunut candidate.');
    localPeer.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));
});

//Listening for the candidate message from a peer sent from onicecandidate handler
socket.on("candiToRemote", msg => {
    console.log("candidate received");
    trace('Seuraavaksi lisätään saapunut candidate.');
    remotePeer.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));
});

//Listening for the candidate message from a peer sent from onicecandidate handler
socket.on("candiToLocal", msg => {
    console.log("candidate received");
    trace('Seuraavaksi lisätään saapunut candidate.');
    localPeer.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));
});


//Listening for Session Description Protocol message with session details from remote peer
socket.on("sdp", msg => {
    console.log("sdp received");
    var sessionDesc = new RTCSessionDescription(JSON.parse(msg).sdp);
    remotePeer.setRemoteDescription(sessionDesc);
    trace('Seuraavaksi luodaan vastaus');
    remotePeer.createAnswer().then(sdp => {
        trace('Vastaus luotu');
        remotePeer.setLocalDescription(new RTCSessionDescription(sdp));
        socket.emit("answer", JSON.stringify({ "sdp": sdp }));
    });
});


socket.on("sdpToRemote", msg => {
    console.log("sdp received", JSON.parse(msg));
    kutsuja = JSON.parse(msg).sender;
    kutsuttava = JSON.parse(msg).receiver;
    console.log(`sdpToRemote - Kutsuja: ${kutsuja}; Kutsuttava: ${kutsuttava}`);

    var sessionDesc = new RTCSessionDescription(JSON.parse(msg).sdp);
    remotePeer.setRemoteDescription(sessionDesc);
    //__
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
        //document.getElementById("selfview").srcObject = stream;
        trace('Seuraavaksi aktivoituu addStream-event');
        //localStream = stream;
        remotePeer.addStream(stream); //------------------------------ TÄTÄ PITÄÄ VIELÄ TUTKIA !!!!!!
        /*
        stream.getTracks().forEach(track => {
            localPeer.addTrack(track, stream); // This returns a RTCRtpSender object
            //console.log(pc.getLocalStreams()); // 191007klo1120 This returns the mediastreams which is connected pc.
        });*/
        //caller.addStream(stream);
        //__
        trace('Seuraavaksi luodaan vastaus');
        remotePeer.createAnswer().then(sdp => {
            trace('Vastaus luotu');
            remotePeer.setLocalDescription(new RTCSessionDescription(sdp));

            console.log("TESTI", JSON.parse(msg));
            let messageToLocal = {};
            messageToLocal.sender = JSON.parse(msg).receiver;
            messageToLocal.receiver = JSON.parse(msg).sender;
            messageToLocal.sdp = sdp;
            console.log('TESTI2', messageToLocal);
            //socket.emit("answer", JSON.stringify({ "sdp": sdp }));
            socket.emit("answerToLocal", JSON.parse(msg).sender, JSON.stringify(messageToLocal));
        });

    }).catch(evt => {
        console.log("Error occurred!", evt);
    });

});

//Listening for answer to offer sent to remote peer
socket.on("answer", answer => {
    console.log("answer received");
    localPeer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer).sdp));
});

socket.on("answerToLocal", answer => {
    console.log("answer received from remote");
    localPeer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer).sdp));
});

socket.on('chat message', (msg) => {
    let liELEM = document.createElement('li');
    liELEM.appendChild(document.createTextNode(msg));
    ulDOM.appendChild(liELEM);
  });
