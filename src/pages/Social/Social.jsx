import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  InputAdornment,
  Dialog,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import Video from "../../components/video/Video.jsx";
import UploadModel from "../../components/uploadModel/UploadModel.jsx";
import { useDispatch } from "react-redux";
import { getAllSocialVideos } from "../../features/filesSlice.js";
import { useParams } from "react-router-dom";
import SingleVideo from "../SingleVideo/SingleVideo.jsx";


const Social = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const filterdata = [
    "all",
    "movies",
    "anime",
    "kids",
    "shorts/reels",
    "trending",
    "yourVideos",
    "courses",
    "music",
    "gaming",
    "news",
    "sports",
    "live",
  ];
  const [upload, setUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalVideos, setTotalVideos] = useState(0);
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();
  const {random} = useParams()

  useEffect(() => {
    const getAllVideos = async () => {
      const res = await dispatch(
        getAllSocialVideos({
          page,
          limit,
          search: searchTerm,
          category: filter,
        })
      );
      setVideos(res.payload.data);
      setTotalVideos(res.payload.total);
    };
    getAllVideos();
  }, [page, limit, searchTerm, filter]);

  const fetchAllRelaltedVideos = (category)=>{
    setFilter(category)
    setPage(1)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUploadClick = () => {
    setUpload(!upload);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (

    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUploadClick}
          sx={{ fontWeight: "bold" }}
        >
          Upload Video
        </Button>

      { !random &&  <TextField
          label="Search Videos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginLeft: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
        />}
      </Box>

  {!random  &&   <Box sx={{ marginTop: 2 }}>
        {filterdata.map((keyword) => (
          <Button
            key={keyword}
            variant="contained"
            onClick={() => setFilter(keyword)}
            sx={{
              margin: "5px",
              backgroundColor: filter === keyword ? "#9C27B0" : "#e0e0e0",
              color: filter === keyword ? "white" : "black",
              "&:hover": {
                backgroundColor: "#9C27B0",
                color: "white",
              },
            }}
          >
            {keyword}
          </Button>
        ))}
      </Box>}

    {random &&   <SingleVideo fetchAllRelaltedVideos={fetchAllRelaltedVideos} random={random}/>
}
      <Box sx={{ marginTop: 3 }}>
        {videos.length > 0 ? (
          <Grid container spacing={3}>
            {videos.map((video, index) => (
              <Grid item xs={12} key={index}>
                <Video video={video} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No videos found matching your search criteria. Please try again.
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Pagination
          count={Math.ceil(totalVideos / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={upload}>
        <UploadModel filterdata={filterdata} close={handleUploadClick} />
      </Dialog>
    </Box>
  );
};

export default Social;
