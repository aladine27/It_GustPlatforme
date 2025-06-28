// components/Global/StepperComponent.jsx
import { Stepper, Step, StepLabel } from "@mui/material";

const StepperComponent = ({ steps = [], activeStep = 0 }) => (
  <Stepper activeStep={activeStep} alternativeLabel>
    {steps.map((label, idx) => (
      <Step key={label || idx}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default StepperComponent;
