import localFont from "next/font/local";

const calSans = localFont({
  src: "./CalSans.otf",
});
export const fontCalSans = calSans.className;

const poppins = localFont({
  src: "./Poppins.ttf",
});
export const fontPoppins = poppins.className;
