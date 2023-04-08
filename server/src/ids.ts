import { nanoid, customAlphabet } from 'nanoid';
export const generatePollId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);
export const generateUserId = () => nanoid();
export const generateNominationId = () => nanoid(8);
