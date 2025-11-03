export type Language = 'en' | 'vi';
export type EditorMode = 'photoId' | 'restoration';

export type PhotoIdSize = '2x3' | '3x4' | '4x6' | '5x5';
export type PaperSize = 'A6' | 'A5' | 'A4';
export type Attire = 'white_shirt' | 'ao_dai' | 'vest_tie' | 'vest_bowtie' | 'custom';
export type HairStyle = 'keep' | 'long_front' | 'long_back' | 'short';
export type BackgroundColor = 'light_blue' | 'white' | 'custom';
export type RestorationMode = 'restore_colorize' | 'high_quality' | 'reconstruct' | 'remove_yellow' | 'sharpen' | 'enhance_details';

export interface PhotoIdOptions {
  size: PhotoIdSize;
  paper: PaperSize;
  attire: Attire;
  customAttire: string;
  faceAndHair: {
    auto: boolean;
    hairStyle: HairStyle;
    skinSmoothing: boolean;
    freckleRemoval: boolean;
    keepFace: boolean;
  };
  background: {
    color: BackgroundColor;
    customColor: string;
  };
}

export interface RestorationOptions {
  mode: RestorationMode;
  advanced: {
    detailedHair: boolean;
    restoreClothing: boolean;
    clarifyBackground: boolean;
    keepFace: boolean;
  };
  customPrompt: string;
}
