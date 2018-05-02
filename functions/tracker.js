module.exports = (functions, admin) => {
  let module = {};

  module.setUserLocation = (req, res) => {
    const callToken = req.path;

    if ( callToken !== functions.config().ifttt.key ) {
      return admin.database().ref(`/locations/${req.body.user_id}`).push(
        {
          location: req.body.location,
          time: (new Date()).toISOString(),
        }
      ).then(
        () => res.sendStatus(200)
      ).catch(
        () => res.sendStatus(500)
      );
    } else {
      return res.sendStatus(403);
    }
  };

  return module;
}
