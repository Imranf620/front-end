import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';
import "./pieChart.css"

export default function PieArcLabel() {
  const { user } = useSelector((state) => state.auth);

  const totalDataInGb = (user.totalFileSize / 1e9).toFixed(2);
  const documentSizeInPerc = ((user.documentSizeInGB / totalDataInGb) * 100).toFixed(2);
  const imageSizeInPerc = ((user.imageSizeInGB / totalDataInGb) * 100).toFixed(2);
  const videoSizeInPerc = ((user.videoSizeInGB / totalDataInGb) * 100).toFixed(2);
  const otherSizeInPerc = ((user.otherSizeInGB / totalDataInGb) * 100).toExponential(2);

  const data = {
    data: [
      { label: 'Documents', value: documentSizeInPerc },
      { label: 'Images', value: imageSizeInPerc },
      { label: 'Videos', value: videoSizeInPerc },
      { label: 'Others', value: otherSizeInPerc },
    ]
  };

  return (
    <div className="pie-chart-container">
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: '60%',
            ...data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
          },
        }}
        {...size}
      />
    </div>
  );
}

const size = {
  width: 400,
  height: 200,
};
