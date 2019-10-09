// FUNCTION --- This function console logs the text and the time it took to get this point.
const trace = text => {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now, text);
};

trace('Seuraavaksi console log socket.');
/*{
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302' // Lisätty tämä objekti ja nyt rivin 37 (onicecandidateHandlerFunc) console log näytää ICE Candidateja.
    }]
}*/
//Initializing a peer connection
let caller = new RTCPeerConnection();
trace('RTCPeerConnection initialized!');

let messageObj = {};

// FUNCTION --- This function starts the nego
const startNegotiation = (myClient, receiver, socket, messageObj) => {
    myClient.createOffer().then(offer => myClient.setLocalDescription(offer)).then(jotain => {
        console.log('Jotain on: ', myClient);
        messageObj.sender = socket.id;
        messageObj.receiver = receiver;
        messageObj.sdp = myClient.localDescription;
        socket.emit('sendOffer', receiver, messageObj);
    });

};

// FUNCTION --- Send the ICE Candidate to the remote peer - Tätä funktiota kutsutaan alla olevassa funktiossa.
const onIceCandidate = (peer, evt) => {
    if (evt.candidate) {
        trace('Seuraavaksi kandidaatti lähetetään socket.io serverille.');
        socket.emit("candidate", JSON.stringify({ "candidate": evt.candidate }));
    }
};

// HANDLERFUNCTION --- Listen for ICE Candidates and send them to remote peers
const onicecandidateHandlerFunc = evt => {
    if (!evt.candidate) return;
    console.log("Icecandidate löydetty!!!");
    //console.log("onicecandidate called");
    console.log('Löydetty candidate on: ', evt); // Kun RTCPeerConnectionissa (~ rivi 11) on alustusobjekti, niin konsoliin tulee candidate-objekteja.
    trace('Seuraavaksi kutsutaan onIceCandidate-funktiota.');
    onIceCandidate(caller, evt); // Kutsutaan funktiota onIceCandidate riviltä ~25.
};

//onaddstream handler to receive remote feed and show in remoteview video element
const onaddstreamHandlerFunc = evt => {
    console.log("onaddstream called");
    trace('Seuraavaksi lisätään striimi remoteview nimiseen elementiin.');
    document.getElementById("remoteview").srcObject = evt.stream;
};

//Get local audio/video feed and show it in selfview video element
trace('Seuraavaksi alkaa getUserMedia');
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    trace('Nyt on saatu kamerasta striimi ja se laitetaan selfview nimiseen elementtiin');
    document.getElementById("selfview").srcObject = stream;
    trace('Seuraavaksi aktivoituu addStream-event');
    caller.addStream(stream);
}).catch(evt => {
    console.log("Error occurred!");
});


//Create and send offer to remote peer on button click
document.getElementById("makeCall").addEventListener("click", () => {
    trace('Soittonappia painettiin!');
    caller.createOffer().then(desc => {
        trace('Offeri tehty');
        caller.setLocalDescription(new RTCSessionDescription(desc));
        trace('SetLocalDescription asetettu ja nyt seuraavaksi lähetetään sdp-tietoja socket.io palvelimelle.');
        socket.emit("sdp", JSON.stringify({ "sdp": desc }));
    });
});


caller.addEventListener('addstream', onaddstreamHandlerFunc);
caller.addEventListener('icecandidate', onicecandidateHandlerFunc);

//Communications with the remote peer through signaling server
socket.on("connect", client => {
    //Connection established with the signaling server
    console.log(`Connected to Socket.io! Your ID is: ${socket.id}.`);
});

socket.on('offerFromUser', msg => console.log('Someone sent a message to you: ', msg));


socket.on('offerForClients', arr => {
    console.log('Server sent this array', arr);
    arr.forEach(element => {
        if (element !== socket.id) {
            //startNegotiation(caller, element, socket, messageObj); // Starts startNegotiation-function, go to line ~20
        }
    });
});


//Listening for the candidate message from a peer sent from onicecandidate handler
socket.on("candidate", msg => {
    console.log("candidate received");
    trace('Seuraavaksi lisätään saapunut candidate.');
    caller.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));
});

//Listening for Session Description Protocol message with session details from remote peer
socket.on("sdp", msg => {
    console.log("sdp received");
    var sessionDesc = new RTCSessionDescription(JSON.parse(msg).sdp);
    caller.setRemoteDescription(sessionDesc);
    trace('Seuraavaksi luodaan vastaus');
    caller.createAnswer().then(sdp => {
        trace('Vastaus luotu');
        caller.setLocalDescription(new RTCSessionDescription(sdp));
        socket.emit("answer", JSON.stringify({ "sdp": sdp }));
    });
});

//Listening for answer to offer sent to remote peer
socket.on("answer", answer => {
    console.log("answer received");
    caller.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer).sdp));
});



/*
//To iron over browser implementation anomalies like prefixes
GetUserMedia();
GetRTCPeerConnection();
GetRTCSessionDescription();
GetRTCIceCandidate();

//Initializing a peer connection
var caller = new window.RTCPeerConnection();

//Listen for ICE Candidates and send them to remote peers
caller.onicecandidate = function(evt){
    if(!evt.candidate) return;
    console.log("onicecandidate called");
    onIceCandidate(caller, evt);
};

//onaddstream handler to receive remote feed and show in remoteview video element
caller.onaddstream = function(evt){
    console.log("onaddstream called");
    if(window.URL){
        document.getElementById("remoteview").src = window.URL.createObjectURL(evt.stream);
    } else {
        document.getElementById("remoteview").src = evt.stream;
    }
};
//Get local audio/video feed and show it in selfview video element
navigator.getUserMedia({video: true, audio: true}, function(stream){
    if(window.URL){
        document.getElementById("selfview").src = window.URL.createObjectURL(stream);
    } else {
        document.getElementById("selfview").src = stream;
    }
    caller.addStream(stream);

}, function(evt){
    console.log("Error occurred!");
});
function GetRTCIceCandidate(){
    window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate
                || window.mozRTCIceCandidate || window.msRTCIceCandidate;

    return window.RTCIceCandidate;
}
function GetUserMedia(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return navigator.getUserMedia;
}
function GetRTCPeerConnection(){
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection
                        || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return window.RTCPeerConnection;
}
function GetRTCSessionDescription(){
    window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription
                    ||  window.mozRTCSessionDescription || window.msRTCSessionDescription;
    return window.RTCSessionDescription;
}

//Create and send offer to remote peer on button click
document.getElementById("makeCall").addEventListener("click", function(){
    caller.createOffer().then(function(desc){
        caller.setLocalDescription(new RTCSessionDescription(desc));
        socket.emit("sdp", JSON.stringify({"sdp": desc}));
    });
});

//Send the ICE Candidate to the remote peer
function onIceCandidate(peer, evt){
    if(evt.candidate){
        socket.emit("candidate", JSON.stringify({"candidate": evt.candidate}));
    }
}

//Communications with the remote peer through signaling server
socket.on("connect", function(client){
    //Connection established with the signaling server
    console.log("connected!");

    //Listening for the candidate message from a peer sent from onicecandidate handler
    socket.on("candidate", function(msg){
        console.log("candidate received");
        console.log(msg, 'candidate');

        caller.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));

    });

    //Listening for Session Description Protocol message with session details from remote peer
    socket.on("sdp", function(msg){
        console.log("sdp received");
        var sessionDesc = new RTCSessionDescription(JSON.parse(msg).sdp);
        caller.setRemoteDescription(sessionDesc);
        caller.createAnswer().then(function(sdp){
            caller.setLocalDescription(new RTCSessionDescription(sdp));
            socket.emit("answer", JSON.stringify({"sdp": sdp}));
        });
    });

    //Listening for answer to offer sent to remote peer
    socket.on("answer", function(answer){
        console.log("answer received");
        caller.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer).sdp));
    });
});

*/