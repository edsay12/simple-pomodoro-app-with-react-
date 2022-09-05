import react, { useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/secondsToTime';
import { Button } from './button';
import { FaRegSun } from 'react-icons/fa';
import { GiTomato } from 'react-icons/gi';
import { GrFormClose } from 'react-icons/gr';
import { FiPlay, FiPause, FiSkipForward } from 'react-icons/fi';
//eslint-disable-next-line @typescript-eslint/no-var-requires
import bellStart from '../sounds/bell-start.mp3';
import bellFinish from '../sounds/bell-finish.mp3';
import Modal from './modal';

interface Props {
  defaultPomodoroTime: number;
  defaultRestShorTime: number;
  defaultRestLongTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);
  const [shortTime, setShortTime] = useState(props.defaultRestShorTime);
  const [longTime, setLongTime] = useState(props.defaultRestLongTime);
  const [forMainTime, setFormMainTime] = useState(props.defaultPomodoroTime);
  const [formShortTime, setFormShortTime] = useState(props.defaultRestShorTime);
  const [formLongTime, setFormLongTime] = useState(props.defaultRestLongTime);

  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(true);
  const [cyclesValue, setCyclesValue] = useState(props.cycles);
  const [formCycles, setFormCycles] = useState(cyclesValue);
  const [cycles, setCycles] = useState(new Array(cyclesValue).fill(true));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const audioStart = new Audio(bellStart);
  const audioFinish = new Audio(bellFinish);
  useEffect(() => {
    configureWork();
    setCycles(new Array(cyclesValue).fill(true));
    console.log('mudou');
  }, [cyclesValue]);
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
    setMainTime(forMainTime);
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
    if (!long) return setMainTime(shortTime);
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
      setCycles(new Array(cyclesValue).fill(true));
    }
  }
  function configureLongBreak() {
    setMainTime(longTime);
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
  function handleSubmit(e: any) {
    e.preventDefault();
    setIsModalOpen(false);
    setMainTime(forMainTime);
    setLongTime(formLongTime);
    setShortTime(formShortTime);
    console.log(formCycles);
    setCyclesValue(Number(formCycles));
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeButtonIco={
          <GrFormClose onClick={() => setIsModalOpen(false)}></GrFormClose>
        }
      >
        <form action="#" method="post" onSubmit={(e) => handleSubmit(e)}>
          <div className="formTitle">Time(minutes)</div>
          <div className="inputGroup">
            <label htmlFor="">
              Pomodoro
              <input
                value={forMainTime}
                onChange={(e: any) => {
                  setFormMainTime(e.target.value);
                }}
                type="number"
                name="Pomodoro"
              />
            </label>
            <label htmlFor="">
              Short Break
              <input
                value={formShortTime}
                onChange={(e: any) => {
                  setFormShortTime(e.target.value);
                }}
                type="number"
                name="short"
              />
            </label>
            <label htmlFor="">
              Long Break
              <input
                value={formLongTime}
                onChange={(e: any) => {
                  setFormLongTime(e.target.value);
                }}
                type="number"
                name="long"
              />
            </label>
          </div>
          <div className="inputWithLabel">
            <label htmlFor="">Long Break Interval</label>
            <input
              value={formCycles}
              onChange={(e: any) => {
                setFormCycles(e.target.value);
              }}
              name={'cycles'}
              type="number"
            />
          </div>
          <div className="formButton">
            <button>
              <Button
                text="OK"
                onClick={() => {
                  console.log('ueps');
                }}
              ></Button>
            </button>
          </div>
        </form>
      </Modal>
      <section className="container">
        <header>
          <h1 className="title">
            <GiTomato></GiTomato> PomoTimer
          </h1>
          <div
            className="configIco"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
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
