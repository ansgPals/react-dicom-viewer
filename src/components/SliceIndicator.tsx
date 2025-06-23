import styled from "@emotion/styled";
import React from "react";

interface SliceIndicatorProps {
  current: number;
  total: number;
}

const SliceIndicator: React.FC<SliceIndicatorProps> = ({ current, total }) => (
  <Indicator>
    <Bar>
      <Thumb
        style={{
          top:
            total > 1
              ? `${Math.ceil(((current - 1) / (total - 1)) * 100)}%`
              : `0%`,
        }}
      />
    </Bar>
  </Indicator>
);

export default SliceIndicator;

const Indicator = styled.div`
  position: absolute;
  right: 10px;
  top: 20px;
  height: 90%;
  width: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
const Bar = styled.div`
  width: 4px;
  height: 100%;
  background: #b3e0ff;
  border-radius: 2px;
  position: relative;
`;
const Thumb = styled.div`
  width: 12px;
  height: 18px;
  background: #007bff;
  border-radius: 6px;
  position: absolute;
  left: -4px;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
`;
