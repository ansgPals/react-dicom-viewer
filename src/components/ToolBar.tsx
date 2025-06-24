import styled from "@emotion/styled";
import React from "react";

interface ToolBarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  onReset: () => void;
  disabled?: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({
  activeTool,
  onToolSelect,
  onReset,
  disabled = false,
}) => (
  <ToolbarContainerVertical>
    <ToolbarTitle>도구</ToolbarTitle>
    <ToolbarButtonsVertical>
      <ToolButton
        active={activeTool === "Pan"}
        onClick={() => onToolSelect("Pan")}
        title="이동(Pan)"
        disabled={disabled}
      >
        이동
      </ToolButton>
      <ToolButton
        active={activeTool === "Length"}
        onClick={() => onToolSelect("Length")}
        title="길이 측정"
        disabled={disabled}
      >
        길이
      </ToolButton>
      <ToolButton
        active={activeTool === "Angle"}
        onClick={() => onToolSelect("Angle")}
        title="각도 측정"
        disabled={disabled}
      >
        각도
      </ToolButton>
      <ResetButton onClick={onReset} title="초기화" disabled={disabled}>
        초기화
      </ResetButton>
    </ToolbarButtonsVertical>
  </ToolbarContainerVertical>
);

export default ToolBar;

const ToolbarContainerVertical = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 20px 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ToolbarTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
`;
const ToolbarButtonsVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
`;
const ToolButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${(props) =>
    props.disabled ? "#f1f3f5" : props.active ? "#007bff" : "#e9ecef"};
  color: ${(props) =>
    props.disabled ? "#adb5bd" : props.active ? "#fff" : "#495057"};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${(props) =>
      props.disabled ? "#f1f3f5" : props.active ? "#0056b3" : "#dee2e6"};
  }
`;
const ResetButton = styled.button`
  padding: 10px 20px;
  background: #e9ecef;
  color: #495057;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #dee2e6;
  }
  &:disabled {
    background: #f1f3f5;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;
