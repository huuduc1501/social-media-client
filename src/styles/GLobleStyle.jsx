import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    html {
        font-size:16px;
    }
    body{
        display: flow-root;
        background-color: ${(props) => props.theme.bg}
    }
    *,*:before,*:after {
        padding: 0;
        margin: 0;
        box-sizing:border-box;
    }
    .container {
        max-width: 1000px;
        margin: 0 auto;
    }

    svg{
        cursor: pointer;
        font-size:24px;
    }
    .ant-modal-content {
        background-color:${(props) => props.theme.surface};
        color: ${(props) => props.theme.onSurface};
    }

    .ant-divider, 
    .ant-divider-horizontal.ant-divider-with-text {
        border-color: ${(props) => props.theme.borderColor};
    }
    .ant-divider-inner-text,.ant-divider-inner-text > *{
        color: ${(props) => props.theme.onBg};
    }

`;
