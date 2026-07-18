import addIcon from './add.svg';
import closeIcon from './close.svg';
import imageIcon from './image.svg';
import uploadIcon from './upload.svg';
import videoIcon from './video.svg';
import chevronDownIcon from './chevron-down.svg';

export const icons = {
  add: addIcon,
  close: closeIcon,
  image: imageIcon,
  upload: uploadIcon,
  video: videoIcon,
  chevronDown: chevronDownIcon
}

export type IconName = keyof typeof icons