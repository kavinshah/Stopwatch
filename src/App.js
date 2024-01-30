import React from 'react';
import './App.css';

class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state={
      sessionLength:this.props.sessionLength,
      breakLength:this.props.breakLength,
      minute:25,
      second:0,
	  sessionTimer:true
    };
    this.handleSessionIncreament=this.handleSessionIncreament.bind(this);
    this.handleSessionDecreament=this.handleSessionDecreament.bind(this);
    this.handleBreakIncreament=this.handleBreakIncreament.bind(this);
    this.handleBreakDecreament=this.handleBreakDecreament.bind(this);
    this.handleReset=this.handleReset.bind(this);
    this.handleStartStop=this.handleStartStop.bind(this);
    this.updateClock=this.updateClock.bind(this);
    this.playBeep = this.playBeep.bind(this);
	this.clockInterval=null;
  }
  
  handleSessionIncreament(event){
    this.setState((state)=>({
      sessionLength:Math.min(60, state.sessionLength+1),
      minute:Math.min(60, state.sessionLength+1)
    }));
  }
  
  handleSessionDecreament(event){
    this.setState((state)=>({
      sessionLength:Math.max(1, state.sessionLength-1),
      minute:Math.max(1, state.minute-1)
    }));
  }
  
  handleBreakIncreament(event){
    this.setState((state)=>({
      breakLength:Math.min(60,state.breakLength+1)
    }));
    
  }
  
  handleBreakDecreament(event){
    this.setState((state)=>({
      breakLength:Math.max(1,state.breakLength-1)
    }));
  }
  
  handleReset(event){
	clearInterval(this.clockInterval);
	this.clockInterval=null;
	this.rewindBeep();
	this.setState((state)=>({
	  minute:25,
	  second:0,
	  sessionLength:25,
	  breakLength:5,
	  sessionTimer:true
	}));
  }
  
  handleStartStop(event){
	if(this.clockInterval !== null){
		//console.log('paused');
		clearInterval(this.clockInterval);		
		this.clockInterval=null;
	} else{
		//console.log('started');
		this.clockInterval = setInterval(this.updateClock, 1000);
	}
  }
  
  updateClock(){
    //console.log(`minute: ${this.state.minute}, seconds:${this.state.second}`);
    if(this.state.minute===0 && this.state.second === 0){
	  this.playBeep();
	  if(this.state.sessionTimer){
		//console.log('break timer started');
		this.setState((state)=>({
							  minute:state.breakLength,
							  second:0,
							  sessionTimer:false
						  }));
	  } else{
		//console.log('session timer started');
		this.setState((state)=>({
							  minute:state.sessionLength,
							  second:0,
							  sessionTimer:true
						  }));
	  }
	  
    }
    else if(this.state.second <= 0){
      //reduce minutes and reset second to 59
	  this.setState((state)=>({
							  minute:state.minute-1,
							  second:59
						  }));
    } else{
      this.setState((state)=>({
							  minute:state.minute,
							  second:state.second-1
						  }));
    }
  }
  
  playBeep(){
    let element = document.getElementById('beep');
    element.play();
  }
  
  rewindBeep(){
    let element = document.getElementById('beep');
    element.load();
  }
  
  render(){
    return (
    <div id='Clock' className='clock'>
      <ToggleLength name={'Break Length'} currentValue={this.state.breakLength} toggleId={'break-length'} labelId={'break-label'} upId={'break-increment'} downId={'break-decrement'} handleIncreament={this.handleBreakIncreament} handleDecreament={this.handleBreakDecreament} />
      <ToggleLength name={'Session Length'} currentValue={this.state.sessionLength} toggleId={'session-length'} labelId={'session-label'} upId={'session-increment'} downId={'session-decrement'} handleIncreament={this.handleSessionIncreament} handleDecreament={this.handleSessionDecreament} />
      <Timer timerType={this.state.sessionTimer?'Session':'Break'} minute={String(this.state.minute)} second={String(this.state.second)} handleReset={this.handleReset} handleStartStop={this.handleStartStop} />
	  <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
    );
  }
}

class ToggleLength extends React.Component{  
  render(){
    return(
      <div>
        <label id={this.props.labelId}>{this.props.name + ' : '}</label>
        <label id={this.props.toggleId}>{this.props.currentValue}</label>
        <div>
          <button id={this.props.downId} onClick={this.props.handleDecreament}>-</button>
          <button id={this.props.upId}  onClick={this.props.handleIncreament}>+</button>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component{
  render(){
    return (
      <div>
        <label id='timer-label'>{this.props.timerType + ' : '}</label>
        <label id='time-left'>{String(this.props.minute).padStart(2,'0')}:{this.props.second.padStart(2,'0')}</label>
        <div>
          <button id='start_stop' onClick={this.props.handleStartStop}>Start/Stop</button>
          <button id='reset' onClick={this.props.handleReset}>Reset</button>
        </div>
      </div>
    );
  }
}

Clock.defaultProps = {
  sessionLength:25,
  breakLength:5,
};

export default Clock;
