import logo from './logo.svg';
import Piano_Comp from "./Piano_Comp.js"
import './App.css';
import Soundfont from 'soundfont-player';

import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
function App() {


  /////////////////////////////////
  const [isPlaying, setIsPlaying] = useState(false);




  const playMidiFile = () => {
    setIsPlaying(true);
    
    fetch('/output.mid')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const midi = new Midi(arrayBuffer);
        const now = Tone.now() + 0.5;
        midi.tracks.forEach(track => {
          track.notes.forEach(note => {
            Tone.start();
            Tone.Transport.start();
            
            // Synth Stuff /////////////////////////////////////////////////
            const synth = new Tone.Synth({
              oscillator: {
                type: 'sine'
              },
              envelope: {
                attack: 0.5,
                decay: 0.2,
                sustain: 0.5,
                release: 1.5
              }
            }).toDestination();
          
            // Define the reverb effect
            const reverb = new Tone.Reverb({
              decay: 2.5,
              wet: 0.2
            }).toDestination();
          
            // Connect the synth to the reverb
            synth.connect(reverb);
            
            synth.volume.value = -12;


            //////////////////////////////////////////////////////////////////////////

            synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
          });
        });
        setIsPlaying(false);
      });
    }
      
  /////////////////////////////////


  return (
    <div className="App">
      <h1>Input your four notes</h1>
      <Piano_Comp/>

      <button onClick={playMidiFile} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play MIDI'}
      </button>
    </div>
    
  );
}

export default App;
