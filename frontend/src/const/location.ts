import bangaloreActive from "../assets/header/location/bangalore-active.png.webp";
import bangalore from "../assets/header/location/bangalore.png.webp";
import chennaiActive from "../assets/header/location/chennai-active.png.webp";
import chennai from "../assets/header/location/chennai.png.webp";
import delhiActive from "../assets/header/location/delhi-active.png.webp";
import delhi from "../assets/header/location/delhi.png.webp";
import gurgaonActive from "../assets/header/location/gurgaon-active.png.webp";
import gurgaon from "../assets/header/location/gurgaon.png.webp";
import hyderabadActive from "../assets/header/location/hyderabad-active.png.webp";
import hyderabad from "../assets/header/location/hyderabad.png.webp";
import jaipurActive from "../assets/header/location/jaipur-active.png.webp";
import jaipur from "../assets/header/location/jaipur.png.webp";
import kolkataActive from "../assets/header/location/kolkata-active.png.webp";
import kolkata from "../assets/header/location/kolkata.png.webp";
import mumbaiActive from "../assets/header/location/mumbai-active.png.webp";
import mumbai from "../assets/header/location/mumbai.png.webp";
import puneActive from "../assets/header/location/pune-active.png.webp";
import pune from "../assets/header/location/pune.png.webp";
import suratActive from "../assets/header/location/surat-active.png.webp";
import surat from "../assets/header/location/surat.png.webp";

type Location = {
  imgSrc: {
    active: string;
    inActive: string;
  };
  name: string;
};

export const popularCities: Location[] = [
  {
    imgSrc: {
      active: delhiActive,
      inActive: delhi,
    },
    name: "Delhi",
  },
  {
    imgSrc: {
      active: mumbaiActive,
      inActive: mumbai,
    },
    name: "Mumbai",
  },
  {
    imgSrc: {
      active: puneActive,
      inActive: pune,
    },
    name: "Pune",
  },
  {
    imgSrc: {
      active: bangaloreActive,
      inActive: bangalore,
    },
    name: "Bangalore",
  },
  {
    imgSrc: {
      active: chennaiActive,
      inActive: chennai,
    },
    name: "Chennai",
  },
  {
    imgSrc: {
      active: gurgaonActive,
      inActive: gurgaon,
    },
    name: "Gurgaon",
  },
  {
    imgSrc: {
      active: hyderabadActive,
      inActive: hyderabad,
    },
    name: "Hyderabad",
  },
  {
    imgSrc: {
      active: jaipurActive,
      inActive: jaipur,
    },
    name: "Jaipur",
  },
  {
    imgSrc: {
      active: kolkataActive,
      inActive: kolkata,
    },
    name: "Kokata",
  },
  {
    imgSrc: {
      active: suratActive,
      inActive: surat,
    },
    name: "Surat",
  },
];
