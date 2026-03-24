import { generateMetadata } from '@tryforge/forgescript'

generateMetadata(
  `${__dirname}/natives`,
  'native',
  'ForgeGamesEvents',
  false,
  undefined,
  `${__dirname}/events`,
)
