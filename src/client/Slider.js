import React from 'react';
import Grid from '@material-ui/core/Grid';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    width: 200,
    margin: '50px 0 0 auto'
  },
}));

const muiTheme = createMuiTheme({
  overrides:{
    MuiSlider: {
      thumb:{
      color: "rgba(25, 255, 217, 0.74);",
      },
      track: {
        color: 'rgba(25, 255, 217, 0.74);'
      },
      rail: {
        color: 'rgba(25, 255, 217, 0.74);'
      }
    }
}
});

const ContinuousSlider = ({value, onChange}) => {
  const classes = useStyles();

const handleChange = (event, newValue) => {
  console.log(newValue);
  
  onChange(newValue)
}  
  return (
    <div className={classes.root}>
      {/* <Typography id="continuous-slider" gutterBottom>
        Volume
      </Typography> */}
      <Grid container spacing={2} >
        <Grid item>
          <VolumeDown style={{ color: "white" }}/>
        </Grid>
        <Grid item xs>
        <ThemeProvider theme={muiTheme}>
          <Slider className="slider" value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
          </ThemeProvider>

        </Grid>
        <Grid item>
          <VolumeUp style={{ color: "white" }}/>
        </Grid>
      </Grid>
    
 
      {/* <Typography id="disabled-slider" gutterBottom>
        Disabled slider
      </Typography>
      <Slider disabled defaultValue={30} aria-labelledby="disabled-slider" /> */}
    </div>
  );

};


export default ContinuousSlider;


// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: 300 + theme.spacing(3) * 2,
//   },
//   margin: {
//     height: theme.spacing(3),
//   },
// }));

// function ValueLabelComponent(props) {
//   const { children, open, value } = props;

//   return (
//     <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
//       {children}
//     </Tooltip>
//   );
// }

// ValueLabelComponent.propTypes = {
//   children: PropTypes.element.isRequired,
//   open: PropTypes.bool.isRequired,
//   value: PropTypes.number.isRequired,
// };

// const iOSBoxShadow =
//   '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

// const marks = [
//   {
//     value: 0,
//   },
//   {
//     value: 20,
//   },
//   {
//     value: 37,
//   },
//   {
//     value: 100,
//   },
// ];


// const PrettoSlider = withStyles({
//   root: {
//     color: '#52af77',
//     height: 8,
//   },
//   thumb: {
//     height: 24,
//     width: 24,
//     backgroundColor: '#fff',
//     border: '2px solid currentColor',
//     marginTop: -8,
//     marginLeft: -12,
//     '&:focus, &:hover, &$active': {
//       boxShadow: 'inherit',
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: 'calc(-50% + 4px)',
//   },
//   track: {
//     height: 8,
//     borderRadius: 4,
//   },
//   rail: {
//     height: 8,
//     borderRadius: 4,
//   },
// })(Slider);

// const AirbnbSlider = withStyles({
//   root: {
//     color: '#3a8589',
//     height: 3,
//     padding: '13px 0',
//   },
//   thumb: {
//     height: 27,
//     width: 27,
//     backgroundColor: '#fff',
//     border: '1px solid currentColor',
//     marginTop: -12,
//     marginLeft: -13,
//     boxShadow: '#ebebeb 0 2px 2px',
//     '&:focus, &:hover, &$active': {
//       boxShadow: '#ccc 0 2px 3px 1px',
//     },
//     '& .bar': {
//       // display: inline-block !important;
//       height: 9,
//       width: 1,
//       backgroundColor: 'currentColor',
//       marginLeft: 1,
//       marginRight: 1,
//     },
//   },
//   active: {},
//   track: {
//     height: 3,
//   },
//   rail: {
//     color: '#d8d8d8',
//     opacity: 1,
//     height: 3,
//   },
// })(Slider);

// function AirbnbThumbComponent(props) {
//   return (
//     <span {...props}>
//       <span className="bar" />
//       <span className="bar" />
//       <span className="bar" />
//     </span>
//   );
// }

// export default function CustomizedSlider() {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Typography gutterBottom>iOS</Typography>
//       <IOSSlider aria-label="ios slider" defaultValue={60} marks={marks} valueLabelDisplay="on" />
//       <div className={classes.margin} />
//       <Typography gutterBottom>pretto.fr</Typography>
//       <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={20} />
//       <div className={classes.margin} />
//       <Typography gutterBottom>Tooltip value label</Typography>
//       <Slider
//         ValueLabelComponent={ValueLabelComponent}
//         aria-label="custom thumb label"
//         defaultValue={20}
//       />
//       <div className={classes.margin} />
//       <Typography gutterBottom>Airbnb</Typography>
//       <AirbnbSlider
//         ThumbComponent={AirbnbThumbComponent}
//         getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
//         defaultValue={[20, 40]}
//       />
//     </div>
//   );
// }
