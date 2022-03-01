import { computed, Ref } from "vue";

type LocationSearchItem = "targetId";

function replaceQueryParam(param: string, newval: string, search: string) {
  var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
  var query = search.replace(regex, "$1").replace(/&$/, "");

  return (
    (query.length > 2 ? query + "&" : "?") +
    (newval ? param + "=" + newval : "")
  );
}

export const useLocationSearch = (key: LocationSearchItem) => {
  return computed({
    get: () => {
      const search = decodeURI(location.search).substring(1).split("&");
      return search.find((x) => x.split("=")[0] === key)?.split("=")[1];
    },
    set: (v) => {
      const newUrl = replaceQueryParam(key, `${v}`, location.search);
      history.pushState("", "", newUrl);
    },
  });
};
