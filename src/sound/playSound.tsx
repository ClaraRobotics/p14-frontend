import touchbeep from '@/assets/sounds/touchbeep.mp3';
export const playSound = () => {
  var audio = new Audio(touchbeep);
  audio.play();
};

