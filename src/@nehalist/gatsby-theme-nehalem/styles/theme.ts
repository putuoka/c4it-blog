const Theme: DefaultTheme = {
    layout: {
     backgroundColor: `#fafafa`,
     primaryColor: `#16316f`,
     linkColor: `#16316f`,
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
       background: `linear-gradient(-45deg, #C0C2CE, #16316f) repeat scroll 0 0 transparent`,
     },
    },
  };
  
  export default Theme;