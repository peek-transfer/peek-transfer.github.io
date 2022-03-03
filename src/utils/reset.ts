export const toResetAll = () => {
  if (confirm("This will clear all user infomation, Are your suer ?")) {
    localStorage.clear();
    location.reload();
  }
};
