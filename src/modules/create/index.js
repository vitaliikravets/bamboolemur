import React, { Component } from 'react';
//import './App.css';
import $ from 'jquery';

class Create extends Component {
  componentDidMount(){
    //var server       = { urls: "stun:stun.l.google.com:19302" };
    //var sdpConstraints = { optional: [{RtpDataChannels: true}]  };
    var pc = new RTCPeerConnection(null);
    var dc;
    pc.oniceconnectionstatechange = function(e) {
      var state = pc.iceConnectionState;
      $('#status').html(state);
      if (state === "connected") $("#msg, #send").attr("disabled", false);
    };
    pc.onicecandidate = function(e) {
      if (e.candidate) return;
      $("#creater-sdp").val(JSON.stringify(pc.localDescription));
    }
    function createOfferSDP() {
      dc = pc.createDataChannel("chat");
      pc.createOffer().then(function(e) {
        pc.setLocalDescription(e)
      });
      dc.onopen = function(){$("textarea").attr("disabled",true);addMSG("CONNECTED!", "info")};
      dc.onmessage = function(e) {
        if (e.data) addMSG(e.data, "other");
      }
    };
    function start() {
      var answerSDP = $('#joiner-sdp').val()
      var answerDesc = new RTCSessionDescription(JSON.parse(answerSDP));
      pc.setRemoteDescription(answerDesc);
    }
    var addMSG = function(msg, who) {
      var wrap = $("<div>").addClass("wrap").appendTo($("#chat-screen"));
      var div  = $("<div>").addClass(who).appendTo(wrap);
      $("<span>").html(who).addClass("who").appendTo(div);
      $("<span>").html(msg).addClass("msg").appendTo(div);
      $("#chat-screen-wp").scrollTop($("#chat-screen").height());
    }
    createOfferSDP();
    var sendMSG = function() {
      var value = $("#msg").val();
      if (value) {
        dc.send(value);
        addMSG(value, "me");
        $("#msg").val('');
      }
    }
    $("#start").click(function(){start();});
    $("#msg").keypress(function(e) {if(e.which === 13) {sendMSG()}});
    $("#send").click(sendMSG);
  }

  render() {
    return (
      <div>
        <h2> CREATE WebRTC channel <span id="status"> init </span></h2>
        <h3> 1.CREATE Offer's SDP </h3>
        <textarea id="creater-sdp"></textarea>
        <h3> 4.GET Participant's SDP <button id="start">start</button></h3>
        <textarea id="joiner-sdp" placeholder="HERE COPY AND PASTE [3.Participant'S SDP]"></textarea>
        <h3> CHAT </h3>
        <div id="chat">
          <div id="chat-screen-wp">
            <div id="chat-screen"></div>
          </div>
          <div id="ct">
            <input id="msg" disabled />
            <button id="send" disabled>send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;