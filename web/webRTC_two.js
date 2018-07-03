// uncahnged code from internet
var sdpConstraints = { optional: [{RtpDataChannels: true}]  };
var pc = new RTCPeerConnection(null);
var dc;

pc.ondatachannel  = function(e) {dc = e.channel; dcInit(dc)};
pc.onicecandidate = function(e) {
  if (e.candidate) return;
  $("#joiner-sdp").val(JSON.stringify(pc.localDescription));
};

pc.oniceconnectionstatechange = function(e) {
  var state = pc.iceConnectionState
  $('#status').html(state);
  if (state === "connected") $("#msg, #send").attr("disabled", false);
};

function dcInit(dc) {
  dc.onopen    = function()  {$("textarea").attr("disabled",true);addMSG("CONNECTED!", "info")};
  dc.onmessage = function(e) {if (e.data) addMSG(e.data, "other");}
}

function createAnswerSDP() {
  var offerDesc = new RTCSessionDescription(JSON.parse($("#creater-sdp").val()));
  pc.setRemoteDescription(offerDesc)
  pc.createAnswer(function (answerDesc) {
    pc.setLocalDescription(answerDesc)
  }, function () {console.warn("Couldn't create offer")},
  sdpConstraints);
};

var sendMSG = function() {
  var value = $("#msg").val();
  if (value) {
    dc.send(value);
    addMSG(value, "me");
    $("#msg").val('');
  }
}

var addMSG = function(msg, who) {
  var wrap = $("<div>").addClass("wrap").appendTo($("#chat-screen"));
  var div  = $("<div>").addClass(who).appendTo(wrap);
  $("<span>").html(who).addClass("who").appendTo(div);
  $("<span>").html(msg).addClass("msg").appendTo(div);
  $("#chat-screen-wp").scrollTop($("#chat-screen").height());
}

$("#create").click(createAnswerSDP);
$("#msg").keypress(function(e) {if(e.which === 13) {sendMSG()}});
$("#send").click(sendMSG);

// <h2>  JOIN WebRTC channel  <span id="status"> init </span> </h2>
// <h3> 2)GET Offers SDP</h3>
// <textarea id="creater-sdp" placeholder="HERE COPY & PASTE [1.CREATE Offer's SDP]"></textarea>
// <h3> 3)CREATE ParticipantS SDP <button id="create">CREATE</button> </h3>
// <textarea id="joiner-sdp"></textarea>
// <h3> CHAT </h3>
// <div id="chat">
//   <div id="chat-screen-wp">
//     <div id="chat-screen"></div>
//   </div>
//   <div id="ct"><input id="msg" disabled /><button id="send" disabled>send</button></div>
// </div>
