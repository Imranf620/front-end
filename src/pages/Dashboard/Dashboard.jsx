import React, { useState } from "react";
import CircularProgressWithLabel from "../../components/circularProgress/CircularProgress";
import Cards from "../../components/cards/Cards";
import RecentFiles from "../../components/recentFiles/RecentFiles";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Typography,Button } from "@mui/material";
import PieArcLabel from "../../components/profileSetting/charts/PieChart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

  const {user,loading} = useSelector(state=>state.auth)
  const navigate = useNavigate()

  console.log(user)


 
  const [showPie, setShowPie] = useState(false);

  const handleOpenPie = () => {
    setShowPie(true);
  };
  const handleRenewSubscription = () => {
   navigate("/packages")
  };



  const handleClosePie = () => {
    setShowPie(false);
  };

  console.log(user?.percentageUsed)

  return (
    <div className="flex gap-4">
      <section className="md:w-2/3 w-full">
      <Box>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgressWithLabel value={Number(user?.percentageUsed)} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Available Storage
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              { (user?.totalFileSize / 1e9).toFixed(2) } GB / { (user?.totalStorageInBytes / 1e9).toFixed(2) } GB
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <button onClick={handleOpenPie} className="underline">
                View All Storage
              </button>
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              Subscription Status
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Days Remaining for Renewal: {user?.remainingDays} days
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleRenewSubscription}
              sx={{ marginTop: 2 }}
            >
              Renew Subscription
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
        <div className="mt-8">
          <Cards/>
        </div>
      </section>
      <section className="w-1/3   rounded-lg md:block hidden">
      <RecentFiles/>
      </section>
      <Dialog open={showPie} onClose={handleClosePie} fullWidth maxWidth="sm">
        <DialogTitle>Storage Breakdown</DialogTitle>
        <DialogContent>
          <PieArcLabel />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePie} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
