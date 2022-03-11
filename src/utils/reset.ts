export const toResetAll = () => {
  if (confirm("This will clear all user infomation, Are your sure ?")) {
    localStorage.clear();
    location.reload();
  }
};
