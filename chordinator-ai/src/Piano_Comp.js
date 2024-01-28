import React, { useState, useEffect } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Soundfont from 'soundfont-player';
import DropdownMenu from './DropdownMenu';
import axios from 'axios';


const Piano_Comp = ({ onKeyPress }) => {
    const [playedNotes, setPlayedNotes] = useState([]);
    const [isPianoDisabled, setIsPianoDisabled] = useState(false);

    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('b4');
    const [formData, setFormData] = useState({
      note1: '',
      note2: '',
      note3: '',
      note4: '',
    });
    
    const onPlayNote = (midiNumber) => {
      if (!isPianoDisabled && playedNotes.length < 4) {
        setPlayedNotes((prevNotes) => [...prevNotes, midiNumber]);
  
        console.log(midiNumber)

        Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(function (piano) {
          piano.play(MidiNumbers.getAttributes(midiNumber).note)
        })

        if (playedNotes.length === 3) {
          setIsPianoDisabled(true);
        }
        console.log(midiNumber);
      }
    };

    const handleGenerateChords = async (e) => {
      setIsPianoDisabled(false);
      setFormData({
        note1: playedNotes[0],
        note2: playedNotes[1],
        note3: playedNotes[2],
        note4: playedNotes[3],
      });
      setPlayedNotes([]);

      e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/notes', formData);


      if (response.status === 200) {
        const result = response.data;
        console.log(result);
        // Handle the result as needed
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    };

    return (
      <div>
        <DropdownMenu />
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {
            onPlayNote(midiNumber)
          }}
          stopNote={(midiNumber) => {
            // Stop playing a given note - see notes below
          }}
          width={1000}
          keyboardShortcuts={null}
        />
        <div>
          <p>Played Notes: {playedNotes.map((midiNumber) => MidiNumbers.getAttributes(midiNumber).note.replace(/\d/g, ''))}</p>
          <button onClick={handleGenerateChords}>Generate Chords</button>
        </div>
      </div>
    );
};

export default Piano_Comp;