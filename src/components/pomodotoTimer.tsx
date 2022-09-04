import react, { useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/secondsToTime';
import { Button } from './button';
import { FaRegSun } from 'react-icons/fa';
import { GiTomato } from 'react-icons/gi';
import { FiPlay, FiPause, FiSkipForward } from 'react-icons/fi';
//eslint-disable-next-line @typescript-eslint/no-var-requires
import bellStart from '../sounds/bell-start.mp3';
import bellFinish from '../sounds/bell-finish.mp3';

interface Props {
  defaultPomodoroTime: number;
  defaultRestShorTime: number;
  defaultRestLongTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(true);
  const [cycles, setCycles] = useState(new Array(props.cycles).fill(true));
  const audioStart = new Audio(bellStart);
  const audioFinish = new Audio(bellFinish);
  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null,
  );
  const configureWork = () => {
    setWorking(true);
    window.document.querySelector('.pomodoro')?.classList.add('selected');
    window.document
      .querySelector('.shortBreakButton')
      ?.classList.remove('selected');
    window.document
      .querySelector('.longBreakButton')
      ?.classList.remove('selected');
    window.document.body.classList.remove('resting');
    window.document.body.classList.remove('longResting');
    window.document.body.classList.add('working');
    // setTimeCounting(false);
    setMainTime(props.defaultPomodoroTime);
    audioStart.play();
  };
  const configureRest = (long = false) => {
    window.document.querySelector('.pomodoro')?.classList.remove('selected');
    window.document
      .querySelector('.shortBreakButton')
      ?.classList.add('selected');
    window.document
      .querySelector('.longBreakButton')
      ?.classList.remove('selected');
    // setTimeCounting(false);
    window.document.body.classList.remove('working');
    window.document.body.classList.remove('longResting');
    window.document.body.classList.add('resting');
    setWorking(false);
    audioFinish.play();
    if (!long) return setMainTime(props.defaultRestShorTime);
    configureLongBreak();
  };
  if (mainTime <= 0) {
    if (working) {
      cycles.pop();
      configureRest();
    } else if (!working) {
      configureWork();
    }
    if (cycles.length <= 0) {
      configureRest(true);
      setCycles(new Array(props.cycles).fill(true));
    }
  }
  function configureLongBreak() {
    setMainTime(props.defaultRestLongTime);
    window.document.body.classList.remove('working');
    window.document.body.classList.remove('resting');
    window.document.body.classList.add('longResting');

    window.document.querySelector('.pomodoro')?.classList.remove('selected');
    window.document
      .querySelector('.shortBreakButton')
      ?.classList.remove('selected');
    window.document
      .querySelector('.longBreakButton')
      ?.classList.add('selected');
  }

  return (
    <>
      <section className="container">
        <header>
          <h1 className="title">
            <GiTomato></GiTomato> PomoTimer
          </h1>
          <div className="configIco">
            <FaRegSun className="ico"></FaRegSun>
            <span>setting</span>
          </div>
        </header>

        <div className="pomodoroButtos">
          <Button
            className="pomodoro"
            text="Pomodoro"
            onClick={() => {
              configureWork();
            }}
          ></Button>
          <Button
            className="shortBreakButton"
            text="Short Break"
            onClick={() => {
              configureRest();
            }}
          ></Button>
          <Button
            className="longBreakButton"
            text="Long Break"
            onClick={() => {
              configureRest(true);
            }}
          ></Button>
        </div>

        <div className="timer">
          <h1>{secondsToTime(mainTime)}</h1>
          <div className="icons">
            <div
              className="playOrPauseIco"
              onClick={() => {
                setTimeCounting(!timeCounting);
              }}
            >
              {timeCounting ? <FiPause></FiPause> : <FiPlay></FiPlay>}
            </div>

            <div
              className="skipIco"
              onClick={() => {
                setMainTime(0);
              }}
            >
              {timeCounting ? <FiSkipForward></FiSkipForward> : ' '}
            </div>
          </div>
        </div>
        <div className="informations">
          <p>Cycles: {cycles.length}</p>
        </div>
      </section>
    </>
  );
}
