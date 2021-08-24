import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    html {
        font-size:16px;
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

`;
