module.exports = {
  siteMetadata: {
    title: `Code4IT`,
    siteUrl: `https://nehalem.netlify.com`,
    description: `A blog for %TOPICS%`,
    topics: [
      `C# devs`,
      `Azure lovers`,
      `Clean Coders`,
      `.NET enthusiasts`
    ],
    menu: [
      {
        name: 'Home',
        path: '/'
      },
      {
        name: 'About me',
        path: '/about-me'
      },        {
        name: 'Talks',
        path: '/talks'
      },
    ],
    footerMenu: [
      {
        name: 'RSS',
        path: '/rss.xml'
      },
      {
        name: 'Sitemap',
        path: '/sitemap.xml'
      }
    ],
    search: true,
    author: {
      name: `code4it`,
      description: `Ciao! I'm <strong>Davide Bellone</strong>, a .NET software developer!
      Let's keep in touch on 
      <a href="https://twitter.com/BelloneDavide" rel="noopener" target="_blank">Twitter!</a>`,
      social: {
        facebook: ``,
        twitter: `https://twitter.com/BelloneDavide`,
        linkedin: `https://www.linkedin.com/in/davide-bellone/`,
        instagram: ``,
        youtube: ``,
        github: ``,
        twitch: ``
      }
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `@nehalist/gatsby-theme-nehalem`,
      options: { // optional theme options
        // location to our content
        contentPath: `content`,
        // the page manifest
        manifest: {
          name: `Code4IT`,
          short_name: `code4it`,
          start_url: `/`,
          background_color: `#a4cbb8`,
          theme_color: `#a4cbb8`,
          display: `minimal-ui`,
          icon: `src/images/gatsby-icon.png`
        },
        // if archive pages should be generated automatically
        loadDefaultPages: true,
        // posts shown on the front page
        postsPerPage: 7
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: "GTM-W6KBN79",
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "GTM-W6KBN79",
        ],
  
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true
        },
      },
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
