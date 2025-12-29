import { GoogleGenAI, Modality } from "@google/genai";
import type { PhotoIdOptions, RestorationOptions, EditorMode, Language } from '../types';
import { translations } from '../constants';

// FIX: Pass 'lang' parameter to determine the language for the prompt.
const buildPhotoIdPrompt = (options: PhotoIdOptions, T: (typeof translations)[Language], lang: Language): string => {
  // FIX: Use 'lang' variable for language check.
  let prompt = lang === 'en'
    ? `You are an expert photo editor. Edit the provided portrait into a professional ID photo. Follow these instructions precisely:\n`
    : `Bạn là một chuyên gia chỉnh sửa ảnh. Hãy chỉnh sửa bức chân dung được cung cấp thành một ảnh thẻ chuyên nghiệp. Tuân thủ chính xác các hướng dẫn sau:\n`;

  // Attire
  let attireDesc = '';
  switch (options.attire) {
    case 'white_shirt': attireDesc = T.whiteShirt; break;
    case 'ao_dai': attireDesc = T.aoDai; break;
    case 'vest_tie': attireDesc = T.vestTie; break;
    case 'vest_bowtie': attireDesc = T.vestBowtie; break;
    case 'custom': attireDesc = options.customAttire; break;
  }
  if (attireDesc) {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en'
      ? `- **Attire:** Replace the person's clothing with a professional '${attireDesc}'.\n`
      : `- **Trang phục:** Thay thế quần áo của người trong ảnh bằng '${attireDesc}' một cách chuyên nghiệp.\n`;
  }

  // Background
  let backgroundDesc = '';
  switch (options.background.color) {
    case 'light_blue': backgroundDesc = T.lightBlue + ' (#e0f2fe)'; break;
    case 'white': backgroundDesc = T.white + ' (#ffffff)'; break;
    case 'custom': backgroundDesc = `the color ${options.background.customColor}`; break;
  }
  // FIX: Use 'lang' variable for language check.
  prompt += lang === 'en'
    ? `- **Background:** Change the background to a solid, even color: ${backgroundDesc}. Ensure clean edges around the person.\n`
    : `- **Nền:** Đổi nền thành màu đồng nhất: ${backgroundDesc}. Đảm bảo các cạnh xung quanh người được cắt gọt sạch sẽ.\n`;

  // Face and Hair
  if (!options.faceAndHair.auto) {
      if(options.faceAndHair.keepFace) {
        // FIX: Use 'lang' variable for language check.
        prompt += lang === 'en' ? `- **Face:** Keep the original face, features, and expression completely unchanged.\n` : `- **Khuôn mặt:** Giữ nguyên hoàn toàn khuôn mặt, các đường nét và biểu cảm gốc.\n`;
      }
      if (options.faceAndHair.skinSmoothing) {
        // FIX: Use 'lang' variable for language check.
        prompt += lang === 'en' ? `- **Skin:** Apply light skin smoothing to reduce blemishes but maintain a natural texture.\n` : `- **Da:** Áp dụng làm mịn da nhẹ để giảm khuyết điểm nhưng vẫn giữ được kết cấu tự nhiên.\n`;
      }
      if (options.faceAndHair.freckleRemoval) {
        // FIX: Use 'lang' variable for language check.
        prompt += lang === 'en' ? `- **Freckles:** Remove any visible freckles from the skin.\n` : `- **Tàn nhang:** Loại bỏ bất kỳ vết tàn nhang nào có thể nhìn thấy trên da.\n`;
      }
      if (options.faceAndHair.hairStyle !== 'keep') {
        let hairDesc = '';
        switch (options.faceAndHair.hairStyle) {
          case 'long_front': hairDesc = T.hairLongFront; break;
          case 'long_back': hairDesc = T.hairLongBack; break;
          case 'short': hairDesc = T.hairShort; break;
        }
        // FIX: Use 'lang' variable for language check.
        prompt += lang === 'en' ? `- **Hair:** Change the hairstyle to '${hairDesc}'.\n` : `- **Tóc:** Đổi kiểu tóc thành '${hairDesc}'.\n`;
      }
  } else {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en' ? `- **Face and Hair:** Automatically enhance the face and hair for a professional and clean look, while keeping the person's identity.\n` : `- **Khuôn mặt và Tóc:** Tự động cải thiện khuôn mặt và tóc để có vẻ ngoài chuyên nghiệp và gọn gàng, trong khi vẫn giữ được danh tính của người đó.\n`;
  }
  
  // FIX: Use 'lang' variable for language check.
  prompt += lang === 'en'
    ? `The final image must be a high-quality, centered portrait suitable for an official ID.`
    : `Ảnh cuối cùng phải là một bức chân dung chất lượng cao, được căn giữa, phù hợp cho một giấy tờ tùy thân chính thức.`;

  return prompt;
};

// FIX: Pass 'lang' parameter to determine the language for the prompt.
const buildRestorationPrompt = (options: RestorationOptions, T: (typeof translations)[Language], lang: Language): string => {
  // FIX: Use 'lang' variable for language check.
  let prompt = lang === 'en'
    ? `You are an expert in photo restoration. Restore the provided old photograph based on the following mode and options:\n`
    : `Bạn là chuyên gia phục chế ảnh. Hãy phục chế bức ảnh cũ được cung cấp dựa trên chế độ và các tùy chọn sau:\n`;

  let modeDesc = '';
  switch (options.mode) {
    case 'restore_colorize': modeDesc = T.restoreColorize; break;
    case 'high_quality': modeDesc = T.highQualityRestore; break;
    case 'reconstruct': modeDesc = T.reconstructDamaged; break;
    case 'remove_yellow': modeDesc = T.removeYellowing; break;
    case 'sharpen': modeDesc = T.sharpen; break;
    case 'enhance_details': modeDesc = T.enhanceDetails; break;
  }
  // FIX: Use 'lang' variable for language check.
  prompt += lang === 'en' ? `- **Mode:** ${modeDesc}. Repair all scratches, tears, folds, and fading. \n` : `- **Chế độ:** ${modeDesc}. Sửa chữa tất cả các vết xước, rách, nếp gấp và phai màu.\n`;

  if (options.advanced.detailedHair) {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en' ? `- Draw fine details in the hair.\n` : `- Vẽ các chi tiết tóc thật kỹ.\n`;
  }
  if (options.advanced.restoreClothing) {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en' ? `- Restore the texture and patterns of the clothing.\n` : `- Phục hồi kết cấu và hoa văn của quần áo.\n`;
  }
  if (options.advanced.clarifyBackground) {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en' ? `- Clarify and restore details in the background.\n` : `- Làm rõ và phục hồi chi tiết ở hậu cảnh.\n`;
  }
  if (options.advanced.keepFace) {
    // FIX: Use 'lang' variable for language check.
    prompt += lang === 'en' ? `- Prioritize keeping the original facial features and likeness intact.\n` : `- Ưu tiên giữ nguyên các đường nét và sự tương đồng của khuôn mặt gốc.\n`;
  }

  if (options.customPrompt?.trim()) {
    prompt += lang === 'en'
      ? `- **Custom Request:** ${options.customPrompt.trim()}\n`
      : `- **Yêu Cầu Tùy Chỉnh:** ${options.customPrompt.trim()}\n`;
  }

  prompt += `\n${T.highResInstruction}`;

  return prompt;
};

export const generateEditedImage = async (
  base64Image: string,
  options: PhotoIdOptions | RestorationOptions,
  mode: EditorMode,
  lang: Language
): Promise<string> => {
    
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const T = translations[lang];
  const prompt =
    mode === 'photoId'
      // FIX: Pass 'lang' to the prompt builder function.
      ? buildPhotoIdPrompt(options as PhotoIdOptions, T, lang)
      // FIX: Pass 'lang' to the prompt builder function.
      : buildRestorationPrompt(options as RestorationOptions, T, lang);

  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: base64Image.match(/:(.*?);/)?.[1] || 'image/png',
    },
  };

  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
    return firstPart.inlineData.data;
  }

  throw new Error("Could not extract image from Gemini response.");
};
