// src/components/VideoCall.js
import React, { useEffect, useRef } from 'react';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  MeetingSessionConfiguration,
  LogLevel
} from 'amazon-chime-sdk-js';

export default function VideoCall({ meeting, attendee }) {
  const localRef  = useRef(null);
  const remoteRef = useRef(null);

  useEffect(() => {
    if (!meeting || !attendee) return;
    const logger = new ConsoleLogger('ChimeLogger', LogLevel.INFO);
    const dc     = new DefaultDeviceController(logger);
    const config = new MeetingSessionConfiguration(
      { Meeting: meeting, Attendee: attendee },
      logger,
      dc
    );
    const session = new DefaultMeetingSession(config, logger, dc);

    const observer = {
      audioVideoDidStart: () => {
        console.log('✅ Chime session started');
        session.audioVideo.startLocalVideoTile();
      },
      videoTileDidUpdate: tileState => {
        console.log('▶️ tile update', tileState);
        if (tileState.localTile && !tileState.isContent) {
          console.log('🔗 binding local tile', tileState.tileId);
          session.audioVideo.bindVideoElement(tileState.tileId, localRef.current);
        }
        if (!tileState.localTile && !tileState.isContent) {
          console.log('🔗 binding remote tile', tileState.tileId);
          session.audioVideo.bindVideoElement(tileState.tileId, remoteRef.current);
        }
      }
    };

    session.audioVideo.addObserver(observer);
    session.audioVideo.start(); // kick off the session

    return () => {
      session.audioVideo.removeObserver(observer);
      session.audioVideo.stopLocalVideoTile();
      session.audioVideo.stop();
    };
  }, [meeting, attendee]);

  return (
    <div style={{ display:'flex', gap:20 }}>
      <div>
        <h4>Local</h4>
        <video
          ref={localRef}
          id="local-video"
          style={{ width:320, height:240, backgroundColor:'#000' }}
          autoPlay muted playsInline
        />
      </div>
      <div>
        <h4>Remote</h4>
        <video
          ref={remoteRef}
          id="remote-video"
          style={{ width:320, height:240, backgroundColor:'#000' }}
          autoPlay playsInline
        />
      </div>
    </div>
  );
}
