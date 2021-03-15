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
      background:`rgb(72,138,153)`,
      background: `linear-gradient(111deg, rgba(72,138,153,1) 32%, rgba(180,180,180,1) 72%, rgba(77,88,91,1) 90%)  scroll `,
     },
    },
  };
  
  export default Theme;