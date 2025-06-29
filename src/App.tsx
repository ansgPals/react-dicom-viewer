import styled from "@emotion/styled";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import { useEffect } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import SeriesViewer from "./pages/SeriesViewer";
import SingleFileViewer from "./pages/SingleFileViewer";

function initializeCornerstone() {
  // Cornerstone 외부 연결
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // Cornerstone Tools 외부 연결
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  // cornerstone-wado-image-loader 설정
  cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr: any) {
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    },
  });

  // Cornerstone Tools 초기화
  cornerstoneTools.init();
}

function App() {
  useEffect(() => {
    initializeCornerstone();
  }, []);

  return (
    <AppContainer>
      <Header>
        <Title>DICOM Viewer</Title>
        <Subtitle>의료 영상 뷰어</Subtitle>
      </Header>

      <Nav>
        <StyledNavLink to="/" end>
          단일 DICOM
        </StyledNavLink>
        <StyledNavLink to="/series">시리즈 DICOM</StyledNavLink>
        <StyledNavLink to="/nifti3d">Nifti 3D</StyledNavLink>
      </Nav>

      <Routes>
        <Route path="/" element={<SingleFileViewer />} />
        <Route path="/series" element={<SeriesViewer />} />
      </Routes>
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 15px;
  gap: 16px;
`;

const StyledNavLink = styled(NavLink)`
  padding: 12px 32px;
  color: #333;
  background: #fff;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: all 0.2s;
  border: 2px solid transparent;

  &.active {
    color: #fff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #764ba2;
    box-shadow: 0 4px 16px rgba(118, 75, 162, 0.15);
  }

  &:hover:not(.active) {
    background: #f0f0f0;
    color: #764ba2;
    border-color: #e0e0e0;
  }
`;
