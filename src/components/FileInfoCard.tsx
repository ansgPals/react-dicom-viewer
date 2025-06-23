import styled from "@emotion/styled";
import React from "react";

interface InfoItem {
  label: string;
  value: React.ReactNode;
}
interface FileInfoCardProps {
  title: string;
  infoList: InfoItem[];
}

const FileInfoCard: React.FC<FileInfoCardProps> = ({ title, infoList }) => (
  <Card>
    <Title>{title}</Title>
    <Grid>
      {infoList.map((item, idx) => (
        <Item key={idx}>
          <Label>{item.label}</Label>
          <Value>{item.value}</Value>
        </Item>
      ))}
    </Grid>
  </Card>
);

export default FileInfoCard;

const Card = styled.div`
  width: 160px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #dee2e6;
`;
const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 13px;
  font-weight: 600;
  color: #343a40;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.span`
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  margin-bottom: 5px;
`;
const Value = styled.span`
  color: #6c757d;
  max-width: 160px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
