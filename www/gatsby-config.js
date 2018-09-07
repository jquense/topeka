const { root } = require('./constants')

const remarkPlugins = [
  'gatsby-remark-prismjs',
  'gatsby-remark-autolink-headers',
]

module.exports = {
  siteMetadata: {
    title: '',
    author: 'Jason Quense',
  },
  plugins: [

    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: root,
        name: 'source',
      },
    },
    {
      resolve: 'gatsby-mdx',
      options: {
        gatsbyRemarkPlugins: remarkPlugins,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: remarkPlugins,
      },
    },
    {
      resolve: 'gatsby-plugin-css-literal-loader',
      options: { extension: '.module.scss' },
    },
  ],
}
