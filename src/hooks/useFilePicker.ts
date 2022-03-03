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
  el.style.position = "absoliute";
  el.style.left = "-1000px";
  el.style.top = "-1000px";

  document.body.append(el);
  el.click();
  const promise = new Promise<FileList>((res, rej) => {
    el.addEventListener("change", (e) => {
      res(el.files!);
      document.body.removeChild(el);
    });
    el.addEventListener("error", rej);
  });
  return await promise;
};
