// frontend/src/features/vto/faceLandmarks.js

// Viền môi ngoài khép kín
export const LIP_OUTER_LOOP = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
  375, 321, 405, 314, 17, 84, 181, 91, 146
];

// Viền môi trong (khoang miệng) - Dùng quy tắc 'evenodd' để KHÔNG tô son lem vào răng
export const LIP_INNER_LOOP = [
  78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
  324, 318, 402, 317, 14, 87, 178, 88, 95
];

// Điểm bắt sáng môi dưới (Tạo hiệu ứng Glossy / Shimmer 3D)
export const LOWER_LIP_HIGHLIGHTS = [17, 84, 314, 181, 405];

// Điểm bắt sáng môi trên (Đỉnh nhân trung Cupid bow & 2 cánh môi trên căng mọng)
export const UPPER_LIP_HIGHLIGHTS = [0, 37, 267, 39, 269, 13, 81, 311];

// Tâm gò má Trái & Phải
export const CHEEK_CENTERS = { LEFT: 205, RIGHT: 425 };

// Bầu mắt Trái & Phải (Eyeshadow)
export const EYESHADOW_LEFT = [226, 247, 30, 29, 27, 28, 56, 190, 243, 173, 157, 158, 159, 160, 161, 246];
export const EYESHADOW_RIGHT = [446, 467, 260, 259, 257, 258, 286, 414, 463, 398, 384, 385, 386, 387, 388, 466];

// Viền khuôn mặt & vùng loại trừ mắt (Foundation)
export const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
];
export const EYE_LEFT_HOLE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
export const EYE_RIGHT_HOLE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

// Các điểm lấy mẫu da chuẩn (Trán, 2 Gò má, Cằm)
export const SKIN_SAMPLE_POINTS = [10, 151, 118, 347, 199];
