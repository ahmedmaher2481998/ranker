import React, { useEffect, useReducer } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';
import { useCopyToClipboard } from 'react-use';
import { colorizeText } from '../util';
import { MdContentCopy, MdOutlinePeopleOutline } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ParticipantList from '../components/ParticipantList';
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
  openConfirmation = 'open_confirmation',
  closeConfirmation = 'close_confirmation',
  closeParticipantList = 'close_participant_list',
}

const WaitingRoom: React.FC = () => {
  const currentState = useSnapshot(state);
  const reducer = (
    state: ReducerState,
    { body, type }: { type: ActionType; body?: any }
  ) => {
    switch (type) {
      case ActionType.confirmRemoveParticipant:
        // expecting  body.id
        state.confirmationMessage = `Remove ${
          currentState.poll?.participants[body.id]
        } from poll?`;
        state.participantToRemove = body.id;
        state.isConfirmationOpen = true;
        return { ...state };

      case ActionType.submitRemoveParticipant:
        if (state.participantToRemove) {
          actions.removeParticipant(state.participantToRemove);
          state.isConfirmationOpen = false;
          state.confirmationMessage = '';
        }
        return { ...state };

      case ActionType.openNominationForm:
        state.isNominationFormOpen = true;
        return { ...state };

      case ActionType.openParticipantList:
        state.isParticipantListOpen = true;
        return { ...state };

      case ActionType.openConfirmation:
        state.isConfirmationOpen = true;
        return { ...state };

      case ActionType.closeConfirmation:
        state.isConfirmationOpen = false;
        return { ...state };

      case ActionType.closeParticipantList:
        state.isParticipantListOpen = false;
        return { ...state };
    }

    return state;
  };
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [reducerState, dispatch] = useReducer(reducer, reducerInitialState);
  useEffect(() => {
    console.log(`Connecting to socket `);
    actions.initializeSocket();
  }, []);

  return (
    <>
      <div className="flex flex-col w-full justify-around items-stretch  h-full mx-auto max-w-sm ">
        <div>
          <h2 className="text-center">Poll Topic</h2>
          <p className="italic text-center mb-4">{currentState.poll?.topic}</p>
          <h2 className="text-center">Poll ID</h2>

          <h3 className="text-center mb-2">Click to copy!</h3>
          <div
            onClick={() => copyToClipboard(currentState.poll?.id || '')}
            className="mb-4 flex justify-center align-middle cursor-pointer"
          >
            <div className="font-extrabold text-center mr-2">
              {currentState.poll && colorizeText(currentState.poll?.id)}
            </div>
            <MdContentCopy size={24} />
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
        <div className="flex flex-col justify-center">
          {currentState.isAdmin ? (
            <>
              <div className="my-2 italic">
                {`${currentState.poll?.votesPerVoter} Nominations Required to Start!`}
              </div>
              <button
                className="box btn-orange my-2"
                disabled={currentState.canStartVote}
                onClick={() => console.log('Start Vote ? ')}
              >
                Start Voting
              </button>
            </>
          ) : (
            <>
              <div className="italic my-2 ">
                Waiting for Admin ,{' '}
                <span className="font-semibold">
                  {currentState.poll?.participants[currentState.poll.adminId]}
                </span>
                , to start the voting.
              </div>
            </>
          )}

          <button
            className="box btn-purple my-2"
            onClick={() => {
              console.log('Leaving poll..');
              dispatch({
                type: ActionType.openConfirmation,
              });
            }}
          >
            Leave Poll
          </button>
          <ConfirmationDialog
            message="You'll be kicked out of the poll"
            showDialog={reducerState.isConfirmationOpen}
            onCancel={() =>
              dispatch({
                type: ActionType.closeConfirmation,
              })
            }
            onConfirm={() => actions.startOver()}
          />
        </div>
      </div>
      <ParticipantList
        isAdmin={currentState.isAdmin || false}
        isOpen={reducerState.isParticipantListOpen}
        onRemoveParticipant={(id) =>
          dispatch({
            type: ActionType.confirmRemoveParticipant,
            body: { id },
          })
        }
        onClose={() => dispatch({ type: ActionType.closeParticipantList })}
        participants={currentState.poll?.participants}
        userID={currentState.me?.id}
      />
    </>
  );
};

export default WaitingRoom;
