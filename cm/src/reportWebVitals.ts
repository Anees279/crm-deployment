import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

// Function to report web vitals (performance metrics)
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Listen for the web vitals events and report them
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
