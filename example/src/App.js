import React, {Suspense} from 'react'

import { ErrorBoundary, ServerComponent, Provider, useProps, useAction} from '@state-less/react-client'
import '@state-less/react-client/dist/index.css'

const ServerTime = (props) => {
  const {time} = useProps();
  const date = new Date;
  date.setTime(time);
  return <div>
    Hey {date.toLocaleTimeString()}
  </div>
}


const Poll = (props) => {
  const serverProps = useProps();
  const {values = [], votes = []} = serverProps;
  const vote = useAction('vote', 'onClick');

  return <div>
    <ul>
      {values.map((value, i) => {
        return <li>
          {value} - {votes[i]} <button onClick={() => vote(i)}>Vote</button>
        </li>        
      })}
    </ul>
    <ruby>
    <rb>WWW</rb><rt>World Wide Web</rt>
  </ruby>
  </div>
}

const Example = () => {
  return <>
      <ErrorBoundary>
    <ServerComponent name="poll">
        <Poll />
    </ServerComponent>
      </ErrorBoundary>
    {/* <ServerComponent name="serverTime">
      <ServerTime />
    </ServerComponent> */}
  </>
}
const App = () => {
  return <Provider url="http://localhost:3000">
    <Suspense fallback="Loading">
      <Example />
    </Suspense>
  </Provider>
}

export default App
