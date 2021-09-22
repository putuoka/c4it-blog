import React, {FunctionComponent} from "react";
import styled from "styled-components";
import {graphql, Link, useStaticQuery} from "gatsby";
import Theme from "../../styles/theme";
import Img from "gatsby-image";

interface LogoProps {
  title: string;
}

const LogoImage = styled(Img)`
  width: 2em;
  // margin: 1em;
  height: 2em;
  // max-height: 70px;


  @media (max-width: ${Theme.breakpoints.sm}) {
    margin-right: 0.3em;
  }
`;

const HomeLink = styled(Link)`
  align-self: center;
  height: 3em;
`;

const Logo: FunctionComponent<LogoProps> = ({title}) => {
  const logo = useStaticQuery(graphql`
    query {
      file(name: {eq: "logo_white_large"}) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  return (
    <HomeLink to={`/`}>
      <LogoImage fixed={logo.file.childImageSharp.fixed} alt={title}/>
    </HomeLink>
  );
}
;

export default Logo;
