// 修复safari 100vh问题
const convertStyle = () => {
  document.body.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", convertStyle);
window.addEventListener("DOMContentLoaded", convertStyle);
