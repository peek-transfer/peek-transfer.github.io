import { UserInfoType } from "../utils/type";
import useStoredRef from "./useStoredRef";

export default function useHistoryUsers(maxLength = 15) {
  const history = useStoredRef("history", { users: [] });
  const users = history.value.users;
  const addUser = (user: UserInfoType & { id: any }) => {
    const index = users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      if (users.length === maxLength) {
        return;
      } else {
        console.log("pushed", user);
        users.unshift(user);
        history.value = { ...history.value, users };
      }
    } else {
      users[index] = user;
      history.value = { ...history.value, users };
    }
  };
  const deleteUser = (id: any) => {
    const index = users.findIndex((u) => u.id === id);
    users.splice(index, 1);
    history.value = { ...history.value, users };
  };
  return {
    users,
    addUser,
    deleteUser,
  };
}
