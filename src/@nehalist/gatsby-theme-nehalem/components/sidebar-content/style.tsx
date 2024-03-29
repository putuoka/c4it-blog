import { createGlobalStyle } from "styled-components"

const AdStyle = createGlobalStyle`
  #carbonads {
    display: block;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 1px 3px hsla(0, 0%, 0%, .05);
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
      'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5;
    max-width: 100%;
    font-size: 12px;
    background-color: #fff;
    margin: 0 0 30px;
    

    @include smallerThan(xs) {
      min-width: 0;
    }
  }

  #carbonads a {
    text-decoration: none;
  }

  #carbonads span {
    position: relative;
    display: block;
    overflow: hidden;
  }

  .carbon-img {
    float: left;
    margin-right: 1em;
  }

  .carbon-img img {
    display: block;
  }

  .carbon-text {
    display: block;
    float: left;
    max-width: calc(100% - 130px - 1em);
    text-align: left;
    color: #637381;
  }

  .carbon-poweredby {
    position: absolute;
    left: 142px;
    bottom: 0;
    display: block;
    font-size: 8px;
    color: #535965;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 1px;
  }
`

export default AdStyle
