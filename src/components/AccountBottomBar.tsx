import React, { useState, useEffect } from 'react';
import { ResultType } from 'api/apollo/generated/graphql';

import { useProject } from 'providers/Project/projectHooks';
import useMousePosition from '../hooks/useMousePosition';
import { Feedback as FeedbackRoot } from 'layout/Feedback';
import { FeedbackActions } from 'layout/FeedbackActions';
import { SidebarItemInsert } from 'layout/SidebarItemInsert';
import styled from '@emotion/styled';
import theme from '../theme';
import { ResizeHeading } from 'layout/Heading';

import { RenderResponse } from 'components/RenderResponse';
import { ClearResults } from './TransactionBottomBar';


const RESULT_PANEL_MIN_HEIGHT = 100;
const STORAGE_PANEL_MIN_HEIGHT = 100 + RESULT_PANEL_MIN_HEIGHT;
const PLAYGROUND_HEADER_HEIGHT = 75;

const TypeListItem = styled.li<{ active: boolean }>`
  padding: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2f2f2f;
  ${(li) => (li.active ? 'background: #f5f5f5;' : '')}
  &:hover {
    background: #f5f5f5;
  }
`;

const AccountStateContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-even;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  border-top: var(--gap) solid var(--key);
  height: ${(p) => p.height}px;
`;

const DeploymentResultContainer = styled.div<{ height: number }>`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background: white;
  border-top: var(--gap) solid var(--key);
  height: ${(p) => p.height}px;
  overflow-y: hidden;
`;

const StorageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: var(--gap) solid var(--key);
`;

interface TypeListProps {
  identifiers: string[];
  selected: string;
  onSelect: (type: string) => void;
	controls: () => any;
	resize: () => any;
}
// @ts-ignore
const IdentifierList: React.FC<TypeListProps> = ({
  identifiers,
  selected,
  onSelect,
	controls,
	resize
}) => (
  <StorageListContainer>
    <ResizeHeading onMouseDown={resize}>Storage {controls()}</ResizeHeading>

    <div
      style={{
        width: '288px',
        overflow: 'auto',
      }}
    >
      <ul>
        {identifiers.map((type: string) => (
          <TypeListItem
            key={type}
            active={type == selected}
            onClick={() => onSelect(type)}
          >
            {type}
          </TypeListItem>
        ))}
      </ul>
    </div>
  </StorageListContainer>
);

const StateContainer: React.FC<{ value: any }> = ({ value }) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#f3f3f3',
      paddingTop: '2em',
      paddingBottom: STORAGE_PANEL_MIN_HEIGHT - 40,
      paddingLeft: '1.5em',
      fontFamily: theme.fonts.monospace,
      fontSize: theme.fontSizes[4],
      overflow: 'scroll',
    }}
  >
    <pre>{JSON.stringify(value, null, 2)}</pre>
  </div>
);

const AccountState: React.FC<{
  state: any;
  renderDeployButton: () => JSX.Element;
}> = ({ state }) => {
  if (!state) {
    state = '{}';
  }

  const storage: { [identifier: string]: string } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const [domain, identifier] = key.split('\u001f');

    if (domain === 'storage') {
      storage[identifier] = parsed[key];
    }
  }

  const identifiers = Object.keys(storage);

  // @ts-ignore
  const [selected, setSelected] = useState(
    identifiers.length > 0 ? identifiers[0] : null,
  );

  const { x, y } = useMousePosition();
  const [storageHeight, setStorageHeight] = useState(STORAGE_PANEL_MIN_HEIGHT);
  const [resultHeight, setResultHeight] = useState(180);
  const [isResizingStorage, setIsResizingStorage] = useState(false);
  const [isResizingResult, setIsResizingResult] = useState(false);

  const toggleResizingStorage = (toggle: boolean) => {
    setIsResizingStorage(toggle);
  };

  const toggleResizingResult = (toggle: boolean) => {
    setIsResizingResult(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizingStorage(false);
    toggleResizingResult(false);
  };

  useEffect(() => {
    if (
      isResizingStorage &&
      y > STORAGE_PANEL_MIN_HEIGHT - 30 + resultHeight &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setStorageHeight(y - resultHeight);
    }
  }, [x, y]);

  useEffect(() => {
    if (
      isResizingResult &&
      y > RESULT_PANEL_MIN_HEIGHT &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setResultHeight(y);
    }
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mouseup', toggleResizeListener, false);
    return () => {
      window.removeEventListener('mouseup', toggleResizeListener, false);
    };
  }, []);

  return (
    <>
      { identifiers.length ? <AccountStateContainer
				height={storageHeight + resultHeight}
      >
        <IdentifierList
          identifiers={identifiers}
          selected={selected}
					onSelect={setSelected}
					resize={() => toggleResizingStorage(true)}
          controls={() => {
            return (
              <SidebarItemInsert grab={false}>
								<></>
              </SidebarItemInsert>
            );
          }}
        />
        <StateContainer value={storage[selected]} />
      </AccountStateContainer> : ''}
      <DeploymentResultContainer height={resultHeight}>
        <ResizeHeading onMouseDown={() => toggleResizingResult(true)}>
          Deployment Result
          <ClearResults type={ResultType.Contract} />
          <div></div>
        </ResizeHeading>
        <RenderResponse resultType={ResultType.Contract} />
      </DeploymentResultContainer>
    </>
  );
};

const AccountBottomBar: React.FC = () => {
  const { project, active, isLoading } = useProject();

  return (
    <FeedbackRoot>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AccountState
            state={project.accounts[active.index].state}
            renderDeployButton={() => {
              return <FeedbackActions />;
            }}
          />
        </>
      )}
    </FeedbackRoot>
  );
};

export default AccountBottomBar;
