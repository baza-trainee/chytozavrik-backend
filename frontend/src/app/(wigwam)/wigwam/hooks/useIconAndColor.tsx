import BrainIcon from 'public/images/brain/brain.svg';
import BrainYellow from 'public/images/brain/brain_yellow.svg';
import BrainGreen from 'public/images/brain/brain_green.svg';

export const useIconAndColor = (firstCharInt: number) => {
  let colorText;
  let icon;

  if (firstCharInt > 0 && firstCharInt < 5) {
    colorText = '#7791FA';
    icon = BrainYellow;
  } else if (firstCharInt === 5) {
    colorText = '#52C974';
    icon = BrainGreen;
  } else {
    colorText = '#B3CDFF';
    icon = BrainIcon;
  }

  return { colorText, icon };
};
