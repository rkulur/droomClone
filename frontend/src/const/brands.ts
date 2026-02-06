import astonMartin from "../assets/home/brand/car/aston_martin.webp";
import audi from "../assets/home/brand/car/audi.webp";
import bentley from "../assets/home/brand/car/bentley.webp";
import bmw from "../assets/home/brand/car/bmw.webp";
import citroen from "../assets/home/brand/car/citroen.webp";
import dodge from "../assets/home/brand/car/dodge.webp";
import ferrari from "../assets/home/brand/car/ferrari.webp";
import ford from "../assets/home/brand/car/ford.webp";
import honda from "../assets/home/brand/car/honda.webp";
import hummer from "../assets/home/brand/car/hummer.webp";
import hyundai from "../assets/home/brand/car/hyundai.webp";
import isuzu from "../assets/home/brand/car/isuzu.webp";
import jaguar from "../assets/home/brand/car/jaguar.webp";
import jeep from "../assets/home/brand/car/jeep.webp";
import kia from "../assets/home/brand/car/kia.webp";
import lamborghini from "../assets/home/brand/car/lamborgini.webp";
import landRover from "../assets/home/brand/car/land_rover.webp";
import lexus from "../assets/home/brand/car/lexus.webp";
import mahindra from "../assets/home/brand/car/mahindra.webp";
import maserati from "../assets/home/brand/car/maserati.webp";
import mclaren from "../assets/home/brand/car/mclaren.webp";
import mercedesBenz from "../assets/home/brand/car/mercedes_benz.webp";
import mg from "../assets/home/brand/car/mg.webp";
import mini from "../assets/home/brand/car/mini.webp";
import nissan from "../assets/home/brand/car/nissan.webp";
import porsche from "../assets/home/brand/car/porche.webp";
import renault from "../assets/home/brand/car/renault.webp";
import rollsRoyce from "../assets/home/brand/car/rolls_royce.webp";
import skoda from "../assets/home/brand/car/skoda.webp";
import suzuki from "../assets/home/brand/car/suzuki.webp";
import tata from "../assets/home/brand/car/tata.webp";
import toyota from "../assets/home/brand/car/toyota.webp";
import volkswagen from "../assets/home/brand/car/volkswagen.webp";
import volvo from "../assets/home/brand/car/volvo.webp";

import aprilia from "../assets/home/brand/bike/aprillia.webp";
import ather from "../assets/home/brand/bike/ather.webp";
import bajaj from "../assets/home/brand/bike/bajaj.webp";
import ducati from "../assets/home/brand/bike/ducati.webp";
import harleyDavidson from "../assets/home/brand/bike/harley_davidson.webp";
import hero from "../assets/home/brand/bike/hero.webp";
import husqvarna from "../assets/home/brand/bike/husqwarna.webp";
import indian from "../assets/home/brand/bike/indian.webp";
import jawa from "../assets/home/brand/bike/jawa.webp";
import kawasaki from "../assets/home/brand/bike/kawasaki.webp";
import ktm from "../assets/home/brand/bike/ktm.webp";
import ola from "../assets/home/brand/bike/ola.webp";
import royalEnfield from "../assets/home/brand/bike/royal_enfield.webp";
import triumph from "../assets/home/brand/bike/triump.webp";
import tvs from "../assets/home/brand/bike/tvs.webp";
import yamaha from "../assets/home/brand/bike/yamaha.webp";
import yezdi from "../assets/home/brand/bike/yezdi.webp";

export type Brand = {
  name: string;
  logo: string;
  link: string;
};

export const carBrands = [
  { name: "Suzuki", logo: suzuki, link: "/brands/suzuki" },
  { name: "Hyundai", logo: hyundai, link: "/brands/hyundai" },
  { name: "Toyota", logo: toyota, link: "/brands/toyota" },
  { name: "Mahindra", logo: mahindra, link: "/brands/mahindra" },
  { name: "Tata", logo: tata, link: "/brands/tata" },
  { name: "Honda", logo: honda, link: "/brands/honda" },
  { name: "Mercedes-Benz", logo: mercedesBenz, link: "/brands/mercedes-benz" },
  { name: "Ford", logo: ford, link: "/brands/ford" },
  { name: "BMW", logo: bmw, link: "/brands/bmw" },
  { name: "Volkswagen", logo: volkswagen, link: "/brands/volkswagen" },

  { name: "Audi", logo: audi, link: "/brands/audi" },
  { name: "Renault", logo: renault, link: "/brands/renault" },
  { name: "Skoda", logo: skoda, link: "/brands/skoda" },
  { name: "Kia", logo: kia, link: "/brands/kia" },
  { name: "MG", logo: mg, link: "/brands/mg" },
  { name: "Land Rover", logo: landRover, link: "/brands/land-rover" },
  { name: "Jeep", logo: jeep, link: "/brands/jeep" },
  { name: "Jaguar", logo: jaguar, link: "/brands/jaguar" },
  { name: "Aston Martin", logo: astonMartin, link: "/brands/aston-martin" },
  { name: "Porsche", logo: porsche, link: "/brands/porsche" },

  { name: "Bentley", logo: bentley, link: "/brands/bentley" },
  { name: "Ferrari", logo: ferrari, link: "/brands/ferrari" },
  { name: "Citroen", logo: citroen, link: "/brands/citroen" },
  { name: "Lexus", logo: lexus, link: "/brands/lexus" },
  { name: "Nissan", logo: nissan, link: "/brands/nissan" },
  { name: "Rolls-Royce", logo: rollsRoyce, link: "/brands/rolls-royce" },
  { name: "Volvo", logo: volvo, link: "/brands/volvo" },
  { name: "Isuzu", logo: isuzu, link: "/brands/isuzu" },
  { name: "Mini", logo: mini, link: "/brands/mini" },
  { name: "Maserati", logo: maserati, link: "/brands/maserati" },

  { name: "Lamborghini", logo: lamborghini, link: "/brands/lamborghini" },
  { name: "McLaren", logo: mclaren, link: "/brands/mclaren" },
  { name: "Hummer", logo: hummer, link: "/brands/hummer" },
  { name: "Dodge", logo: dodge, link: "/brands/dodge" },
];

export const bikeBrands = [
  { name: "Bajaj", logo: bajaj, link: "/brands/bajaj" },
  { name: "Hero", logo: hero, link: "/brands/hero" },
  { name: "Honda", logo: honda, link: "/brands/honda" },
  { name: "Royal Enfield", logo: royalEnfield, link: "/brands/royal-enfield" },
  { name: "TVS", logo: tvs, link: "/brands/tvs" },
  { name: "Yamaha", logo: yamaha, link: "/brands/yamaha" },
  { name: "KTM", logo: ktm, link: "/brands/ktm" },
  { name: "Aprilia", logo: aprilia, link: "/brands/aprilia" },
  { name: "Suzuki", logo: suzuki, link: "/brands/suzuki" },
  {
    name: "Harley-Davidson",
    logo: harleyDavidson,
    link: "/brands/harley-davidson",
  },

  { name: "Jawa", logo: jawa, link: "/brands/jawa" },
  { name: "Ather", logo: ather, link: "/brands/ather" },
  { name: "BMW", logo: bmw, link: "/brands/bmw" },
  { name: "Indian", logo: indian, link: "/brands/indian" },
  { name: "Ducati", logo: ducati, link: "/brands/ducati" },
  { name: "Triumph", logo: triumph, link: "/brands/triumph" },
  { name: "Husqvarna", logo: husqvarna, link: "/brands/husqvarna" },

  { name: "Kawasaki", logo: kawasaki, link: "/brands/kawasaki" },
  { name: "Ola", logo: ola, link: "/brands/ola" },
  { name: "Yezdi", logo: yezdi, link: "/brands/yezdi" },
];
