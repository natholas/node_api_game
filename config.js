module.exports = {
  jwtExperation: 60 * 60 * 24,
  zoom: 50,
  tickInterval: 5000,
  baseResourceNeeds: {
    metal: {
      metal: 15,
      mineral: 12
    }, mineral: {
      metal: 10,
      mineral: 17
    }, energy: {
      metal: 12,
      mineral: 12
    }, production: {
      metal: 20,
      mineral: 20
    }, research: {
      metal: 20,
      mineral: 20
    }
  }
}