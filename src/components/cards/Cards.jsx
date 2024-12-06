import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PieChartIcon from '@mui/icons-material/PieChart';
import { dataTypes } from "../../assets/data";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Cards = () => {

  const {user,loading} = useSelector(state=>state.auth)

  const {isDarkMode} = useTheme()
  return (
    <div className="grid grid-cols-1 z-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 gap-y-16 place-items-center p-4">
      {dataTypes.map((item) => (
        <Link to={item.link} key={item.id} className={`relative ${isDarkMode?"bg-[#272727]":"bg-white"} rounded-xl  p-4 shadow-lg max-w-[260px] w-full transform hover:scale-105 transition duration-300`}>
          <div className={`absolute -top-4 -left-4 rounded-br-[70%] pr-4 pb-4 ${isDarkMode?"bg-black":"bg-gray-200"} grid place-items-center`}>
            <div
              className="w-12 h-12 rounded-full  flex items-center text-white justify-center shadow-md"
              style={{ backgroundColor: item.color }}
            >
              {item.icon === "ArticleIcon" && <ArticleIcon  />}
              {item.icon === "PermMediaIcon" && <PermMediaIcon  />}
              {item.icon === "VideoCallIcon" && <VideoCallIcon  />}
              {item.icon === "PieChartIcon" && <PieChartIcon  />}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold w-full text-end ">{item.title==="Documents"?(user.documentSizeInGB):item.title==="Images"?(user.imageSizeInGB):item.title==="Media"?(user.videoSizeInGB):(user.otherSizeInGB) }GB</h1>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <h2 className="text-lg font-bold ">{item.title}</h2>
            <p className="text-sm ">Last updated</p>
            <p className="text-sm ">{item.lastUpdated}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cards;
