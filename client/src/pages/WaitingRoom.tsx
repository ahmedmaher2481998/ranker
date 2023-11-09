import React, { useEffect, useReducer } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';
import { useCopyToClipboard } from 'react-use';
import { colorizeText } from '../util';
import { MdOutlinePeopleOutline } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
type ReducerState = {
  isParticipantListOpen: boolean;
  isNominationFormOpen: boolean;
  isConfirmationOpen: boolean;
  confirmationMessage: string;
  participantToRemove: string;
  showConfirmation: boolean;
};
const reducerInitialState = {
  isParticipantListOpen: false,
  isNominationFormOpen: false,
  isConfirmationOpen: false,
  confirmationMessage: '',
  participantToRemove: '',
  showConfirmation: false,
};
enum ActionType {
  openParticipantList = 'open_participant_list',
  openNominationForm = 'open_nomination_form',
  confirmRemoveParticipant = 'confirm_remove_participant',
  submitRemoveParticipant = 'submit_remove_participant',
}

const WaitingRoom: React.FC = () => {
  const currentState = useSnapshot(state);
  const reducer = (
    state: ReducerState,
    { body, type }: { type: ActionType; body: any }
  ) => {
    switch (type) {
      case ActionType.confirmRemoveParticipant:
        // expecting  body.id
        state.confirmationMessage = `Remove ${
          currentState.poll?.participants[body.id]
        } from poll?`;
        state.participantToRemove = body.id;
        state.isConfirmationOpen = true;
        return state;
      case ActionType.submitRemoveParticipant:
        if (state.participantToRemove) {
          actions.removeParticipant(state.participantToRemove);
          state.isConfirmationOpen = false;
          state.confirmationMessage = '';
        }
        return state;
      case ActionType.openNominationForm:
        state.isNominationFormOpen = true;
        return state;
      case ActionType.openParticipantList:
        state.isParticipantListOpen = true;
        return state;
    }

    return state;
  };
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [redcuerState, dispatch] = useReducer(reducer, reducerInitialState);
  useEffect(() => {
    console.log(`Connecting to socket `);
    actions.initializeSocket();
  }, []);

  return (
    <div className="flex flex-col w-full justify-around items-stretch  h-full mx-auto max-w-sm ">
      <div>
        <h2 className="text-center">Poll Topic</h2>
        <p className="italic text-center mb-4">{currentState.poll?.topic}</p>
        <h2 className="text-center">Poll ID</h2>
        <div className="text-center mb-2">
          {colorizeText(currentState.poll?.id || '')}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="box btn-orange mx-2 pulsate"
          onClick={() =>
            dispatch({ type: ActionType.openParticipantList, body: {} })
          }
        >
          <MdOutlinePeopleOutline size={24} />
          <span>{currentState.participantCount}</span>
        </button>

        <button
          className="box btn-purple mx-2 pulsate"
          onClick={() =>
            dispatch({ type: ActionType.openNominationForm, body: {} })
          }
        >
          <BsPencilSquare size={24} />
          <span>{currentState.nominationCount}</span>
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
