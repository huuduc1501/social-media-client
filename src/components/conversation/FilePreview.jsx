import React from "react";
import styled from "styled-components";

import { ClipOutlined, CloseIcon } from "../Icon";

const Wrapper = styled.div`
  width: max-content;
  height: max-content;
  position: relative;
  /* padding: 0.4rem; */
  background-color: ${(props) => props.theme.surface};
  border-radius: 12px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
  }
  .file__name {
    padding: .2rem 0.4rem;
    display: flex;
    align-items: center;
    gap: .2rem;
  }

  .file__name svg {
    width: 16px;
    height: 16px;
  }

  .remove__file {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
    border-radius: 50%;
    /* padding: 0.2rem; */
    background-color: ${(props) => props.theme.bg};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remove__file svg {
    width: 1rem;
    height: 1rem;
  }
`;

const FilePreview = ({ setFileList, file }) => {
  const handleRemoveFile = () => {
    setFileList((fileList) => fileList.filter((f) => f.uid !== file.uid));
  };
  return (
    <Wrapper>
      <div className="file__content">
        {file.type.includes("image") ? (
          <img src={file.imageSrc} alt="thumb " />
        ) : (
          <div className="file__name">
            <ClipOutlined />
            <span>
            {file.name}
            </span>
          </div>
        )}
      </div>
      <div className="remove__file" onClick={handleRemoveFile}>
        <CloseIcon />
      </div>
    </Wrapper>
  );
};

export default FilePreview;
