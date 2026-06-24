import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

const reportWebVitals = (onMetric = console.log) => {
  onCLS(onMetric);
  onFCP(onMetric);
  onINP(onMetric);
  onLCP(onMetric);
  onTTFB(onMetric);
};

export default reportWebVitals;
