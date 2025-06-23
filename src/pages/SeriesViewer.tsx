import React from "react";
import DicomViewer from "../components/DicomViewer";

const SeriesViewer: React.FC = () => {
  return <DicomViewer isSingle={false} />;
};

export default SeriesViewer;
