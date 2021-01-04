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
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
