type FileType = "image" | "file";
type Arg = {
  type: FileType;
  multiple: boolean;
};

export const useFilePicker = async (
  config: Arg = { type: "file", multiple: false }
) => {
  const el = document.createElement("input");
  el.type = config.type;
  el.accept = "*";
  el.style.position = "absolute";
  el.style.left = "-1000px";
  el.style.top = "-1000px";
  el.style.opacity = "0";

  document.body.append(el);
  el.focus();
  el.click();
  const remove = () => {
    if (el.parentNode === document.body) {
      document.body.removeChild(el);
    }
  };
  const promise = new Promise<FileList>((res, rej) => {
    el.addEventListener("change", (e) => {
      res(el.files!);
      remove();
    });
    el.addEventListener("error", rej);
    el.addEventListener("blur", () => {
      remove();
    });
  });
  return await promise;
};
