module.exports = {
  flags: { PRESERVE_WEBPACK_CACHE: true },
  siteMetadata: {
    title: `Code4IT`,
    siteUrl: `https://www.code4it.dev`,
    description: `A blog for %TOPICS%`,
    topics: [`C# devs`, `Azure lovers`, `Clean Coders`, `.NET enthusiasts`],
    menu: [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "About me",
        path: "/about-me",
      },
      {
        name: "Public speaking",
        path: "/talks",
      },
      {
        name: "Main Articles",
        path: "/tag/mainarticle",
      },
      {
        name: "Clean Code Tips",
        path: "/tag/clean-code-tip",
      },
      {
        name: "C# Tips",
        path: "/tag/csharp-tip",
      },
      {
        name: "Code and Architecture Notes",
        path: "/tag/dcan",
      },
    ],
    footerMenu: [
      {
        name: "RSS",
        path: "/rss.xml",
      },
      {
        name: "Sitemap",
        path: "/sitemap.xml",
      },
    ],
    search: true,
    author: {
      name: `code4it`,
      description: `Ciao! I'm <strong>Davide Bellone</strong>, a .NET software developer and <b>Microsoft MVP</b>
      Let's keep in touch on 
      <a href="https://twitter.com/BelloneDavide" rel="noopener" target="_blank">Twitter</a>
       or on <a href="https://www.linkedin.com/in/bellonedavide/" rel="noopener" target="_blank">LinkedIn</a>
      `,
      social: {
        facebook: ``,
        twitter: `https://twitter.com/BelloneDavide`,
        linkedin: `https://www.linkedin.com/in/bellonedavide/`,
        instagram: ``,
        youtube: ``,
        github: `https://github.com/code4it-dev`,
        twitch: ``,
      },
    },
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
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "nofollow noopener noreferrer",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              isIconAfterHeader: true,
            },
          },
        ],
      },
    },
    {
      resolve: `@nehalist/gatsby-theme-nehalem`,
      options: {
        // optional theme options
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
          icon: `src/images/new/favicon.png`,
        },
        // if archive pages should be generated automatically
        loadDefaultPages: true,
        // posts shown on the front page
        postsPerPage: 7,
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: "GTM-W6KBN79",
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,
      },
    },
    {
      resolve: "gatsby-plugin-load-script",
      options: {
        id: "s9-sdk",
        async: true,
        defer: true,
        content: "1930161e42694a06b8e7ca268e4c8653",
        src: "socialshare.min.js",
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: ["GTM-W6KBN79"],

        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                var index = nthIndex(edge.node.html, "<p>", 5)
                var content = edge.node.html.slice(0, index)
                var postUrl =
                  site.siteMetadata.siteUrl + edge.node.frontmatter.path

                content +=
                  '<p>Continue reading on <a href="' +
                  postUrl +
                  '">Code4IT</a></p>'

                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.excerpt,
                  date: edge.node.frontmatter.created,
                  url: postUrl,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [{ "content:encoded": content }],
                })
              })
            },
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___created] },
                filter: { fileAbsolutePath: { regex: "/(posts)/.*\\\\.md$/" } }
              ) {
                edges {
                  node {
                    html
                    frontmatter {
                      title
                      excerpt
                      path
                      created
                    }
                  }
                }
              }
            }
            `,
            output: `/rss.xml`,
            title: `Code4IT Articles feed`,
            match: "^/blog/",
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

function nthIndex(str, pat, n) {
  var L = str.length,
    i = -1
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i)
    if (i < 0) break
  }
  return i
}
