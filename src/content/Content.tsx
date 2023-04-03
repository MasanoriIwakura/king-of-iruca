import React, { ReactElement } from 'react';

const Content = (): ReactElement => {
  // NOTE: It won't render unless you wait a bit
  setTimeout(async () => {
    const startButton = document.querySelector<HTMLElement>('.record-clock-in');
    const endButton = document.querySelector<HTMLElement>('.record-clock-out');
    const nameText = document.querySelector<HTMLElement>('#employee_name');

    if (startButton === null || endButton === null || nameText === null) {
      throw new Error('Failed to load page.');
    }

    // check settings.
    getSettings();

    startButton.addEventListener('click', () => sendIruca('start'));
    endButton.addEventListener('click', () => sendIruca('end'));

    nameText.nextElementSibling === null &&
      nameText.insertAdjacentHTML(
        'afterend',
        '<div class="text-bold text-x-large" style="color:red">Now connecting iruca</div>'
      );
  }, 1000);

  return <></>;
};

type Target = 'start' | 'end';

const sendIruca = async (target: Target) => {
  const { roomCode, memberId, startMessage, endMessage } = getSettings();

  await fetch(`https://iruca.co/api/rooms/${roomCode}/members/${memberId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: target === 'start' ? startMessage : endMessage,
      message: '',
    }),
  });
};

const getSettings = () => {
  const roomCode = import.meta.env.VITE_IRUCA_ROOM_CODE;
  const memberId = import.meta.env.VITE_IRUCA_MEMBER_ID;
  const startMessage = import.meta.env.VITE_IRUCA_START_MESSAGE ?? '在席';
  const endMessage = import.meta.env.VITE_IRUCA_END_MESSAGE ?? '退勤';

  const results = {
    roomCode,
    memberId,
    startMessage,
    endMessage,
  };

  if (!roomCode || !memberId || !startMessage || !endMessage) {
    console.error(results);
    throw new Error('Failed to load settings.');
  }

  return results;
};

export default Content;
