

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';



const CircularProgressWithLabel = (props) => {
  return (
    <Gauge
    cx={100}
    cornerRadius={40}
    value={props?.value}
    
    startAngle={-160}
    endAngle={160}
    height={200}
    sx={{
      [`& .${gaugeClasses.valueText}`]: {
        fontSize: 20,
        transform: 'translate(0px, 0px)',
      },

      [`& .${gaugeClasses.valueArc}`]: {
        // fill: '#ffff',
        
      },
    }}
  
    text={
       ({ value, valueMax }) => `${props?.value}% 
        space used `
    }

  />
  );
};

export default CircularProgressWithLabel;
