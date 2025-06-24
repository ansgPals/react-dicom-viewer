import styled from "@emotion/styled";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FileInfoCard from "./FileInfoCard";
import SliceIndicator from "./SliceIndicator";
import ToolBar from "./ToolBar";
import UploadZone from "./UploadZone";
import WWWCBar from "./WWWCBar";

interface DicomViewerProps {
  isSingle: boolean;
  width?: number;
  height?: number;
}

const DicomViewer: React.FC<DicomViewerProps> = ({
  isSingle,
  width = 512,
  height = 512,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string>("Pan");
  const [windowWidth, setWindowWidth] = useState<number>(400);
  const [windowCenter, setWindowCenter] = useState<number>(40);
  const [fileList, setFileList] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // 파일 업로드 핸들러
  const handleFiles = useCallback((files: File[]) => {
    const dicoms = Array.from(files).filter(
      (file) => file.name.endsWith(".dcm") || file.type === "application/dicom"
    );
    setFileList(dicoms);
    setCurrentIndex(0);
    setError(dicoms.length === 0 ? "유효한 DICOM 파일이 없습니다." : "");
  }, []);

  // WW/WC 프리셋 핸들러
  const handlePreset = (ww: number, wc: number) => {
    setWindowWidth(ww);
    setWindowCenter(wc);
    if (elementRef.current) {
      const viewport = cornerstone.getViewport(elementRef.current);
      viewport.voi.windowWidth = ww;
      viewport.voi.windowCenter = wc;
      cornerstone.setViewport(elementRef.current, viewport);
    }
  };

  // 마우스 휠로 슬라이스 이동 (시리즈 모드만)
  useEffect(() => {
    if (!elementRef.current || isSingle) return;
    const element = elementRef.current;
    const onWheel = (e: WheelEvent) => {
      if (fileList.length < 2) return;
      e.preventDefault();
      setCurrentIndex((prev) => {
        let next = prev + (e.deltaY > 0 ? 1 : -1);
        if (next < 0) next = 0;
        if (next >= fileList.length) next = fileList.length - 1;
        return next;
      });
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [fileList.length, isSingle]);

  // cornerstone 이미지 로딩 및 툴 세팅
  useEffect(() => {
    if (!elementRef.current || fileList.length === 0) return;
    const element = elementRef.current;
    let isActive = true;
    const loadImage = async () => {
      try {
        cornerstone.enable(element);
        const file = isSingle ? fileList[0] : fileList[currentIndex];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const imageId = `wadouri:${url}`;
        const image = await cornerstone.loadImage(imageId);
        if (!isActive) return;
        cornerstone.displayImage(element, image);
        setWindowWidth(image.windowWidth || 400);
        setWindowCenter(image.windowCenter || 40);
        // Pan(이동) - 마우스 왼쪽 버튼 항상 활성화
        if (!cornerstoneTools.getToolForElement(element, "Pan")) {
          cornerstoneTools.addTool(cornerstoneTools.PanTool);
        }
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
        // Zoom(확대/축소) - 마우스 오른쪽 버튼 항상 활성화
        if (!cornerstoneTools.getToolForElement(element, "Zoom")) {
          cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        }
        cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });
        // 나머지 툴(길이, 각도 등)은 툴바에서 선택 시 활성화
        switch (activeTool) {
          case "Pan":
            if (!cornerstoneTools.getToolForElement(element, "Pan")) {
              cornerstoneTools.addTool(cornerstoneTools.PanTool);
            }
            cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
            cornerstoneTools.setToolDisabled("Length", element);
            cornerstoneTools.setToolDisabled("Angle", element);
            break;
          case "Length":
            if (!cornerstoneTools.getToolForElement(element, "Length")) {
              cornerstoneTools.addTool(cornerstoneTools.LengthTool);
            }
            cornerstoneTools.setToolActive("Length", { mouseButtonMask: 1 });
            cornerstoneTools.setToolDisabled("Pan", element);
            cornerstoneTools.setToolDisabled("Angle", element);
            break;
          case "Angle":
            if (!cornerstoneTools.getToolForElement(element, "Angle")) {
              cornerstoneTools.addTool(cornerstoneTools.AngleTool);
            }
            cornerstoneTools.setToolActive("Angle", { mouseButtonMask: 1 });
            cornerstoneTools.setToolDisabled("Pan", element);
            cornerstoneTools.setToolDisabled("Length", element);
            break;
          default:
            cornerstoneTools.setToolDisabled("Pan", element);
            cornerstoneTools.setToolDisabled("Length", element);
            cornerstoneTools.setToolDisabled("Angle", element);
            break;
        }
      } catch (error) {
        setError("DICOM 이미지를 불러올 수 없습니다.");
      }
    };
    loadImage();
    return () => {
      isActive = false;
      if (element && element.parentNode) {
        try {
          cornerstone.disable(element);
        } catch (error) {}
      }
    };
  }, [fileList, currentIndex, activeTool, isSingle]);

  return (
    <ViewerWrapper>
      <ViewerRow>
        <LeftBar>
          <ToolBar
            activeTool={activeTool}
            onToolSelect={setActiveTool}
            onReset={() => {
              if (elementRef.current) cornerstone.reset(elementRef.current);
            }}
            disabled={fileList.length === 0}
          />
          <WWWCBar
            windowWidth={windowWidth}
            windowCenter={windowCenter}
            onWWChange={(ww: number) => handlePreset(ww, windowCenter)}
            onWCChange={(wc: number) => handlePreset(windowWidth, wc)}
            onPreset={handlePreset}
            disabled={fileList.length === 0}
          />
          <FileInfoCard
            title="파일 정보"
            infoList={
              fileList.length > 0
                ? [
                    { label: "총 파일 수", value: fileList.length },
                    {
                      label: "현재 인덱스",
                      value: `${isSingle ? 1 : currentIndex + 1} / ${
                        fileList.length
                      }`,
                    },
                    {
                      label: "파일명",
                      value: fileList[isSingle ? 0 : currentIndex]?.name,
                    },
                    {
                      label: "크기",
                      value: `${(
                        fileList[isSingle ? 0 : currentIndex]?.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`,
                    },
                  ]
                : []
            }
          />
        </LeftBar>
        <div>
          <UploadZone
            onFilesSelected={handleFiles}
            accept=".dcm,.dicom"
            multiple={!isSingle}
            label={
              isSingle
                ? "DICOM 파일을 업로드하세요"
                : fileList.length > 0
                ? `${fileList.length}개 파일 선택됨`
                : "DICOM 폴더를 업로드하세요"
            }
            {...(!isSingle
              ? { webkitdirectory: "true", directory: "true" }
              : {})}
          />
          <ViewerContainer
            ref={elementRef}
            width={width}
            height={height}
            onContextMenu={(e) => e.preventDefault()}
          >
            {!isSingle && fileList.length > 0 && (
              <SliceIndicator
                current={currentIndex + 1}
                total={fileList.length}
              />
            )}
          </ViewerContainer>{" "}
          <p className="info">
            마우스 왼쪽 버튼: 이동, 마우스 오른쪽 버튼: 확대/축소
          </p>
        </div>
      </ViewerRow>
      {isSingle ? (
        <ErrorMsg style={{ visibility: "hidden" }}>-</ErrorMsg>
      ) : (
        error && <ErrorMsg>{error}</ErrorMsg>
      )}
    </ViewerWrapper>
  );
};

export default DicomViewer;

const ViewerContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  overflow: hidden;
  background-color: #000;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 24px 0 0 0;
`;

const ViewerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 40px 0 0 0;
`;

const ViewerRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  justify-content: center;
  gap: 24px;
  width: fit-content;
  padding: 40px;
  background-color: white;
  border-radius: 15px;
  .info {
    color: #0082f4;
    font-size: 14px;
    margin: 0;
    padding: 0;
    line-height: 30px;
    text-align: center;
  }
`;

const LeftBar = styled.div`
  border-radius: 15px;
  padding: 20px 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
  width: 200px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ErrorMsg = styled.div`
  color: #dc3545;
  font-weight: 600;
  margin-top: 16px;
`;
