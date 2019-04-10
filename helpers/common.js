function stateIsExpired(ctx) {
  const EXPIRE_SECOND = 120; // second
  if (ctx.state.startFrom === 0) {
    return false;
  }
  console.log('timeout second: ');
  console.log(Math.floor(Date.now() / 1000) - ctx.state.startFrom);
  return (
    Math.floor(Date.now() / 1000) - ctx.state.startFrom > EXPIRE_SECOND
  );
}

module.exports = {
  stateIsExpired
};
