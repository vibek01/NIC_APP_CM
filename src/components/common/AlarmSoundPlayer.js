// src/components/common/AlarmSoundPlayer.js
import React, { useImperativeHandle, forwardRef } from "react";
import { useAudioPlayer } from "expo-audio";

const audioSource = require("../../../assets/sounds/alarm.mp3");

const AlarmSoundPlayer = forwardRef((props, ref) => {
  const player = useAudioPlayer(audioSource);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (!player.isPlaying) {
        player.seekTo(0);
        player.play();
      }
    },
    stop: () => {
      if (player.isPlaying) {
        player.stop();
      }
    },
  }));

  return null;
});

export default AlarmSoundPlayer;
