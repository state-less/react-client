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
    ACTION {typeof vote}
    SERVER PROPS {JSON.stringify(serverProps)}
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

const local = "http://localhost:3000";
const ec2 = "";

const serverless = "wss://serverless.state-server.state-less.cloud/dev2"; // "wss://ocreifr8b1.execute-api.us-east-1.amazonaws.com/dev2" //

const App = () => {
  return <Provider url={serverless} urls={['ws://localhost:8080']}>
    <Suspense fallback="Loading">
      <Example />
    </Suspense>
  </Provider>
}

export default App
