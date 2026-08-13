function notifyBugCreated(bug) {
  console.log(`Notification sent for bug #${bug.id}`);
  return {
    success: true,
    bugId: bug.id
  };
}

module.exports = {
  notifyBugCreated
};