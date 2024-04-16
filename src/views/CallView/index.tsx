"use client"

import { LocalAudioStream, LocalP2PRoomMember, LocalVideoStream, SkyWayContext, SkyWayRoom, SkyWayStreamFactory } from "@skyway-sdk/room";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSkywayToken } from "./hooks/createSkywayToken";

export const CallView = React.memo(() => {
  const { skywayToken } = useSkywayToken();
  const localVideo = useRef<HTMLVideoElement>(null)
  const [localStream, setLocalStream] = useState<{
    audio: LocalAudioStream;
    video: LocalVideoStream;
  }>();
  const [ roomName, setRoomName ] = useState("");
  const [ me, setMe ] = useState<LocalP2PRoomMember>();
  const canJoin = useMemo(() => {
    return localStream != null && me == null;
  }, [localStream, me]);

  const handleJoinButton = useCallback(async () => {
    if (localStream == null || skywayToken == null) return;
    const context = await SkyWayContext.Create(skywayToken);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: 'nihei',
    });
    const me = await room.join();
    setMe(me);
    await me.publish(localStream.video);
    await me.publish(localStream.audio);
    console.log("ok")
  }, [localStream, skywayToken]);

  useEffect(() => {
    const init = async () => {
      if (skywayToken == null || localVideo.current == null) return;
      const stream = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
      stream.video.attach(localVideo.current);

      await localVideo.current.play();
      setLocalStream(stream);
    };

    init();
  }, [skywayToken, localVideo]);

  return (
    <div>
      <p>ID:{me?.id ?? ""} </p>
      <div>
        room name: <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <button onClick={handleJoinButton} disabled={!canJoin}>join</button>
      </div>
      <video ref={localVideo} className="w-[400px]" muted playsInline></video>
      <div>{/* TODO ここに他の人のメディア */}</div>
    </div>
  );
});
CallView.displayName = "CallView";
