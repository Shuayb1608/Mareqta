import withSession from '../../lib/session'
import marqetaClient from '../../lib/marqetaClient';

export default withSession(async (req, res) => {
  req.session.destroy()
  res.json({ isSignedIn: false })
})
