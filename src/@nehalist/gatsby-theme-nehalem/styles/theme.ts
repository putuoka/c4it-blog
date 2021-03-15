const Theme: DefaultTheme = {
    layout: {
     backgroundColor: `#fafafa`,
     primaryColor: `#dbae58`,
     secondaryColor: `#488a99`,
     linkColor: `#488a99`,
     textColor:`#4d585b`
    },
    breakpoints: {
     xs: `425px`,
     sm: `576px`,
     md: `768px`,
     lg: `992px`,
     xl: `1300px`,
    },
    fonts: {
     base: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, ` +
       `Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    },
    components: {
     container: {
       width: `1260px`,
     },
     header: {
       height: `320px`,
       background:  `linear-gradient(-45deg, #488a99, #b4b4b4) 0px 0px repeat scroll transparent`,
     },
    },
  };
  
  export default Theme;