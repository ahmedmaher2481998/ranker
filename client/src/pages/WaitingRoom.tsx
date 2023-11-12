import React, { useEffect, useReducer, useState } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';
import { useCopyToClipboard, useStateWithHistory } from 'react-use';
import { colorizeText } from '../util';
import { MdContentCopy, MdOutlinePeopleOutline } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ParticipantList from '../components/ParticipantList';
import NominationForm from '../components/NominationForm';
/*
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
*/
// const reducer = (
//   state: ReducerState,
//   { body, type }: { type: ActionType; body?: any }
// ) => {
//   switch (type) {
//     case ActionType.confirmRemoveParticipant:
//       // expecting  body.id
//       state.confirmationMessage = `Remove ${
//         currentState.poll?.participants[body.id]
//       } from poll?`;
//       state.participantToRemove = body.id;
//       state.isConfirmationOpen = true;
//       return { ...state };

//     case ActionType.submitRemoveParticipant:
//       if (state.participantToRemove) {
//         actions.removeParticipant(state.participantToRemove);
//         state.isConfirmationOpen = false;
//         state.confirmationMessage = '';
//       }
//       return { ...state };

//     case ActionType.openNominationForm:
//       state.isNominationFormOpen = true;
//       return { ...state };

//     case ActionType.openParticipantList:
//       state.isParticipantListOpen = true;
//       return { ...state };

//     case ActionType.openConfirmation:
//       state.isConfirmationOpen = true;
//       return { ...state };

//     case ActionType.closeConfirmation:
//       state.isConfirmationOpen = false;
//       return { ...state };

//     case ActionType.closeParticipantList:
//       state.isParticipantListOpen = false;
//       return { ...state };
//   }

//   return state;
// };
const WaitingRoom: React.FC = () => {
  // const [reducerState, dispatch] = useReducer(reducer, reducerInitialState);
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  // will use useState instead of useReducer , way more simple
  const [isParticipantListOpen, setIsParticipantListOpen] =
    useState<boolean>(false);
  const [isNominationFormOpen, setIsNominationFormOpen] =
    useState<boolean>(false);
  const [isConformationOpen, setIsConformationOpen] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [participantToRemove, setParticipantToRemove] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const currentState = useSnapshot(state);
  const confirmRemoveParticipant = (id: string) => {
    setConfirmationMessage(
      `Remove ${currentState.poll?.participants[id]} from poll?`
    );
    setParticipantToRemove(id);
    setIsConformationOpen(true);
  };

  const submitRemoveParticipant = () => {
    if (participantToRemove) actions.removeParticipant(participantToRemove);
    setIsConformationOpen(false);
  };

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
            onClick={() => setIsParticipantListOpen(true)}
          >
            <MdOutlinePeopleOutline size={24} />
            <span>{currentState.participantCount}</span>
          </button>

          <button
            className="box btn-purple mx-2 pulsate"
            onClick={() => setIsNominationFormOpen(true)}
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
                disabled={!currentState.canStartVote}
                onClick={() => actions.startVote()}
              >
                Start Voting
              </button>
            </>
          ) : (
            <>
              <div className="italic my-2 ">
                Waiting for{' '}
                <span className="font-semibold">
                  {currentState.poll?.participants[currentState.poll.adminId]}
                </span>
                ,to start the voting.
              </div>
            </>
          )}

          <button
            className="box btn-purple my-2"
            onClick={() => setShowConfirmation(true)}
          >
            Leave Poll
          </button>
          {/* Confirming  leaving the poll */}
          <ConfirmationDialog
            message="You'll be kicked out of the poll"
            showDialog={showConfirmation}
            onCancel={() => setShowConfirmation(false)}
            onConfirm={() => actions.startOver()}
          />
          {/* Confirming removing another player */}
          <ConfirmationDialog
            showDialog={isConformationOpen}
            message={confirmationMessage}
            onCancel={() => setIsConformationOpen(false)}
            onConfirm={submitRemoveParticipant}
          />
        </div>
      </div>
      <ParticipantList
        isAdmin={currentState.isAdmin || false}
        isOpen={isParticipantListOpen}
        onRemoveParticipant={confirmRemoveParticipant}
        onClose={() => setIsParticipantListOpen(false)}
        participants={currentState.poll?.participants}
        userID={currentState.me?.id}
      />
      <NominationForm
        isAdmin={currentState.isAdmin || false}
        isOpen={isNominationFormOpen}
        onRemoveNomination={(id) => actions.removeNomination(id)}
        onSubmitNomination={(text) => actions.nominate(text)}
        nominations={currentState.poll?.nominations}
        userID={currentState.me?.id}
        onClose={() => setIsNominationFormOpen(false)}
        title={currentState.poll?.topic}
      />
    </>
  );
};

export default WaitingRoom;
