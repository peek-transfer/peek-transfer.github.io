export default function getRandomName() {
  return ["A", "B", "C", "D"][Math.round(Math.random() * 3)];
}

export const getRandomColor = () => {
  return ["aqua", "green", "gray", "royalblue"][Math.round(Math.random() * 3)];
};
