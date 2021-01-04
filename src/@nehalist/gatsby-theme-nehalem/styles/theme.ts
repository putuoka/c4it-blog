const Theme: DefaultTheme = {
    layout: {
     backgroundColor: `#fafafa`,
     primaryColor: `#4F72C5`,
     linkColor: `#4F72C5`,
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
       background: `linear-gradient(-45deg, #C0C2CE, #4F72C5) repeat scroll 0 0 transparent`,
     },
    },
  };
  
  export default Theme;