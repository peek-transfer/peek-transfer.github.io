import { onBeforeUnmount } from "vue";

export default function usePreventScroll() {
  const scrollEvents = ["touchstart", "scroll"];
  const preventScrollFn = (e: Event) => {
    document.body.style.position = "fixed";
    e.preventDefault();
    e.stopPropagation();
  };
  scrollEvents.forEach((eventName) => {
    document.body.addEventListener(eventName, (e) => {
      document.body.style.position = "fixed";
      e.preventDefault();
      e.stopPropagation();
    });
  });
  onBeforeUnmount(() => {
    scrollEvents.forEach((eventName) => {
      document.body.removeEventListener(eventName, preventScrollFn);
    });
  });
}
