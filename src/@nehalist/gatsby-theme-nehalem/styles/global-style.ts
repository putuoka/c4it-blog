import {createGlobalStyle} from "styled-components";
import Theme from "./theme";
// import styledNormalize from "styled-normalize";
import * as prismStyle from "prismjs/themes/prism-okaidia.css";

const GlobalStyle = createGlobalStyle`
  ${prismStyle}

  html {
    box-sizing: border-box;
    background-color: ${Theme.layout.backgroundColor};
  }

  body {
    font-family: ${Theme.fonts.base};
    line-height: 1.9em;
    color: ${Theme.layout.textColor};
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    outline: none;
    color: ${Theme.layout.textColor};
    
  }

  a {
    color: #000;
    text-decoration: none;
  }

  .gatsby-highlight {
    max-width: 100% !important;
  }

  .gatsby-highlight-code-line {
    background-color: #353631;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
  }

 article.post img {
      display: block;
      margin: 30px auto !important;
  }

  button[class*="ToggleTocButton"] {
    background-color: ${Theme.layout.secondaryColor};

    svg {
      margin-top: 45%;
    }
  }
 

  div[class*="SearchContainer"] ul[class*="NavMenu"] {
    margin: 0 1em 0px 0;
  }

  table {
    border: 2px solid ${Theme.layout.primaryColor};
    width: 100%;
    text-align: center;
    border-collapse: collapse;

    td, th {
      border: 1px solid ${Theme.layout.primaryColor};
      padding: 3px 2px;
    }
 
    tbody td {
      font-size: 13px;
    }

    tr:nth-child(even) {
      background: ${Theme.layout.primaryColor}B3;
    }

    thead {
      background: ${Theme.layout.primaryColor};
   
      th {
        font-size: 19px;
        font-weight: bold;
        text-align: center;
        border-left: 2px solid ${Theme.layout.primaryColor}83;
  
        th:first-child {
          border-left: none;
        }
      }
    }
  }

div[class*="NavContainer"]{
  background-color: ${Theme.layout.textColor};
}

header[class*="StyledHeader"]>div[class*="NavContainer"]{
  background-color: initial;
}
  
article.post>section[class*="StyledPost"]>p img{
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

div[class*="StyledSubheader"]{
  background-color: ${Theme.layout.primaryColor};
}

`;

export default GlobalStyle;
