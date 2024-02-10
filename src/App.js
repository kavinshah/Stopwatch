import React, {useState, useEffect} from 'react';
import './App.css';

function Clock({bl, sl}){
	const [sessionTimer, setSessionTimer] = useState(true);
	const [sessionLength, setSessionLength] = useState(sl);
	const [breakLength, setBreakLength] = useState(bl);
	
	const handleSessionIncreament = (event) => {
		setSessionLength(Math.min(60, sessionLength+1));
	}

	const handleSessionDecreament = (event) => {
		setSessionLength(Math.max(1, sessionLength-1));
	}
	
	const handleBreakIncreament = (event) => {
		setBreakLength(Math.min(60, breakLength+1));
	}
	
	const handleBreakDecreament = (event) => {
		setBreakLength(Math.max(1, breakLength-1));
	}
	
	const handleResetButtonClick = (event) => {
		setSessionLength(25);
		setBreakLength(5);
	}
	
	return (
		<div id='Clock' className='clock'>
		  <ToggleLength name={'Break Length'} currentValue={breakLength} toggleId={'break-length'} labelId={'break-label'} upId={'break-increment'} downId={'break-decrement'} handleIncreament={handleBreakIncreament} handleDecreament={handleBreakDecreament} />
		  <ToggleLength name={'Session Length'} currentValue={sessionLength} toggleId={'session-length'} labelId={'session-label'} upId={'session-increment'} downId={'session-decrement'} handleIncreament={handleSessionIncreament} handleDecreament={handleSessionDecreament} />
		  <Timer sessionLength={sessionLength} breakLength={breakLength} handleResetButtonClick={handleResetButtonClick} />
		  <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
		</div>
	);
}

function ToggleLength({labelId, name, toggleId, currentValue, downId, upId, handleDecreament, handleIncreament}){
	return(
      <div>
        <label id={labelId}>{name + ' : '}</label>
        <label id={toggleId}>{currentValue}</label>
        <div>
          <button id={downId} onClick={handleDecreament}>-</button>
          <button id={upId}  onClick={handleIncreament}>+</button>
        </div>
      </div>
    );
}

function Timer({sessionLength, breakLength, handleResetButtonClick}){
	const [sessionTimer, setSessionTimer] = useState(true);
	const [minutes, setMinutes] = useState(sessionLength);
	const [seconds, setSeconds] = useState(0);
	const [timerStarted, setTimerStarted] = useState(false);
	const [changeAllowed, setChangeAllowed] = useState(true);
	
	const handleStartStop = (event) => {
		if(!timerStarted){
			setTimerStarted(true);
		} else{
			setTimerStarted(false);
		}
	}
	
	const handleReset = (event) => {
		setTimerStarted(false);
		handleResetButtonClick(event);
		setChangeAllowed(true);
		setMinutes(25);
		setSeconds(0);
	}
	
	useEffect(()=>{
		let intervalId;
		if(timerStarted){
			intervalId= setInterval(()=>{
				updateClock();
			}, 1000);
		}
		else if(changeAllowed){
			setMinutes(sessionLength);
			setSeconds(0);
		}
		return () => {
			clearInterval(intervalId);
		}
	});
	
	const updateClock = () => {
		//console.log(`Entering: minutes: ${minutes}, seconds:${seconds}, timer:${clockInterval}`);
		if(minutes === 0 && seconds === 0){
			playBeep();
			if(sessionTimer){
				//console.log('break timer started');
				setMinutes(breakLength);
				setSeconds(0);
				setSessionTimer(false);
			} else{
				//console.log('session timer started');
				setMinutes(sessionLength);
				setSeconds(0);
				setSessionTimer(true);
			}
		}
		else if(seconds === 0){
			//reduce minutes and reset second to 59
			setMinutes((prev) => prev-1);
			setSeconds(59);
		} else if(minutes >= 0 && seconds > 0){
			setMinutes((prev) => prev);
			setSeconds((prev) => prev-1);
		}
		//console.log(`Leaving: minute: ${minutes}, seconds:${seconds}, timer:${clockInterval}`);
	}
	
	const playBeep = () => {
		let element = document.getElementById('beep');
		element.play();
	}
	
	const rewindBeep = () => {
		let element = document.getElementById('beep');
		element.load();
	}
	
	return (
      <div>
        <label id='timer-label'>{sessionTimer?'Session : ':'Break : '}</label>
        <label id='time-left'>{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</label>
        <div>
          <button id='start_stop' onClick={handleStartStop}>Start/Stop</button>
          <button id='reset' onClick={handleReset}>Reset</button>
        </div>
      </div>
    );
}

Clock.defaultProps = {
  sl:25,
  bl:5
};

export default Clock;
