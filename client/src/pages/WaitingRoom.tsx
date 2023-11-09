import React, { useEffect, useReducer } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';
import { useCopyToClipboard } from 'react-use';
type ReducerState = {
  isParticipantListOpen: boolean;
  isNominationFormOpen: boolean;
  isConfirmationOpen: boolean;
  confirmationMessage: string;
  participantToRemove: string;
  showConfirmation: boolean;
};
const initialState = {
  isParticipantListOpen: false,
  isNominationFormOpen: false,
  isConfirmationOpen: false,
  confirmationMessage: '',
  participantToRemove: '',
  showConfirmation: false,
};
enum ActionType {
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
    }

    return state;
  };
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [redcuerState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    console.log(`Connecting to socket `);
    actions.initializeSocket();
  }, []);

  return (
    <div className="flex flex-col w-full justify-around items-stretch  h-full mx-auto max-w-sm ">
      <h3 className="text-center">Waiting Room </h3>
    </div>
  );
};

export default WaitingRoom;
