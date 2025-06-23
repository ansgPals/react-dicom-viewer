import React from "react";
import DicomViewer from "../components/DicomViewer";

const SingleFileViewer: React.FC = () => {
  return <DicomViewer isSingle={true} />;
};

export default SingleFileViewer;
