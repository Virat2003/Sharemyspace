
import { AiFillCar, AiOutlineAppstore } from "react-icons/ai";
import { FaHouseUser, FaWarehouse } from "react-icons/fa";
import { BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { AiOutlineDatabase } from 'react-icons/ai';

export const categories = [
  {
    label: "All",
    icon: <AiOutlineAppstore />, 
  },
  {
    img: "assests/parking.jpg",
    label: "Parking Spaces",
    icon: <AiFillCar />,
    description: "Find and book parking spots easily",
  },
  {
    img: "assests/room.jpg",
    label: "Rooms",
    icon: <FaHouseUser />,
    description: "Rent a private or shared room",
  },

  {
    img: "assests/storage_cat.webp",
    label: "Storage",
    icon: <FaWarehouse />,
    description: "Secure storage spaces for your needs",
  },
  {
    img: "assests/modern_cat.webp",
    label: "Offices/Meeting Rooms",
    icon: <BsPersonWorkspace />,
    description: "Book workspaces or meeting areas",
  },
];


export const types=[
  {
    name:"An entire place",
    description:"Guests have the whole space to themsevels",
    icon: <FaHouseUser />
  },
  {
    name:"Room",
    description:"Guests have their own room in a house",
    icon:<BsFillDoorOpenFill />
  },
  {
    name:"Storage",
    description:"Space to store items-Warehouse corner,garage,storage room",
    icon:<AiOutlineDatabase/>
  },
]

