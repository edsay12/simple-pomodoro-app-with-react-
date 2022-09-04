import { PomodoroTimer } from './components/pomodotoTimer';
import { Button } from './components/button';

function App(): JSX.Element {
  return (
    <>
      <PomodoroTimer
        defaultPomodoroTime={1500} // 25min
        defaultRestLongTime={900} // 15min
        defaultRestShorTime={600} // 10 min
        cycles={4}
      />
    </>
  ); // time in seconds
}

export default App;
