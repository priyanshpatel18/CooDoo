import { create } from "zustand";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: string;
  workspaceId: number;
  bgColor?: string | null;
}

export interface Workspace {
  id: number;
  workspaceName: string;
  todos: Todo[] | undefined;
}

export interface UserData {
  id: number;
  displayName?: string;
  email?: string;
}

interface UserState {
  user: UserData | undefined;
  setUser: (user: UserData | undefined) => void;

  workspaces: Workspace[] | undefined;
  setWorkspaces: (workspaces: Workspace[] | undefined) => void;
}

const UserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => {
    if (user) {
      set({ user });
    }
  },
  workspaces: undefined,
  setWorkspaces: (workspaces) => {
    if (workspaces) {
      set({ workspaces });
    }
  },
}));

export default UserStore;
