import styled from "@emotion/styled";
import React from "react";

interface WWWCBarProps {
  windowWidth: number;
  windowCenter: number;
  onWWChange: (v: number) => void;
  onWCChange: (v: number) => void;
  onPreset: (ww: number, wc: number) => void;
  disabled?: boolean;
}

const WWWCBar: React.FC<WWWCBarProps> = ({
  windowWidth,
  windowCenter,
  onWWChange,
  onWCChange,
  onPreset,
  disabled = false,
}) => (
  <Bar>
    <SliderGroupVertical>
      <SliderLabel>밝기(WW)</SliderLabel>
      <input
        type="range"
        min={1}
        max={4000}
        value={windowWidth}
        onChange={(e) => onWWChange(Number(e.target.value))}
        disabled={disabled}
      />
      <SliderValue>{windowWidth}</SliderValue>
    </SliderGroupVertical>
    <SliderGroupVertical>
      <SliderLabel>대비(WC)</SliderLabel>
      <input
        type="range"
        min={-1000}
        max={1000}
        value={windowCenter}
        onChange={(e) => onWCChange(Number(e.target.value))}
        disabled={disabled}
      />
      <SliderValue>{windowCenter}</SliderValue>
    </SliderGroupVertical>
    <PresetGroupVertical>
      <PresetButton onClick={() => onPreset(40, 40)} disabled={disabled}>
        40/40
      </PresetButton>
      <PresetButton onClick={() => onPreset(40, 80)} disabled={disabled}>
        40/80
      </PresetButton>
    </PresetGroupVertical>
  </Bar>
);

export default WWWCBar;

const Bar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  border-top: 1px solid #dee2e6;
  padding: 18px 0 10px 0;
`;
const SliderGroupVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
`;
const SliderLabel = styled.span`
  font-size: 1rem;
  color: #495057;
  font-weight: 600;
`;
const SliderValue = styled.span`
  font-size: 1rem;
  color: #007bff;
  font-weight: 700;
`;
const PresetGroupVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
`;
const PresetButton = styled.button`
  padding: 6px 16px;
  background: #e9ecef;
  color: #007bff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #007bff;
    color: #fff;
  }
  &:disabled {
    background: #f1f3f5;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;
