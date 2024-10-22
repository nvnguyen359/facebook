const files = [
  "D:\\Hieu\\Mß║ích Bß║úo vß╗ç pin 3s30a full linh kiß╗çn V3.1 chuß║⌐n nh├á m├íy bangwa/5888004346499.mp4",
  "D:\\Hieu\\Mß║ích Bß║úo vß╗ç pin 3s30a full linh kiß╗çn V3.1 chuß║⌐n nh├á m├íy bangwa/z5888070230509_b393057f696721cd07f06e1013a0e3d9.jpg",
  "D:\\Hieu\\Mß║ích Bß║úo vß╗ç pin 3s30a full linh kiß╗çn V3.1 chuß║⌐n nh├á m├íy bangwa/z5888070230509_b393057f696721cd07f06e1013a0e3d9.jpg",
];
const formatVideo = ["mp4", "mov", "avi", "mkv", "wmv"];
let fileVideos = files.filter((pathFile) => {
  const t = pathFile.split(".");
  if (formatVideo.includes(t[t.length - 1])) {
    return pathFile;
  }
});
//console.log(fileVideos)

