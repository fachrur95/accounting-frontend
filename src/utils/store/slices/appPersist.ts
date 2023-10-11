import menuData from "@/components/layouts/Navigations/SidebarMenu/data";
import { type StateCreator } from "zustand";

type OpenMenuType = Record<string, boolean>

type InitialStateI = Record<string, boolean>;

export const initialStateMenu: InitialStateI = Object.fromEntries(
  menuData.map((i) => [i.url, false])
);

type FormType = {
  branch: {
    open: boolean;
    id?: string;
  },
  globalMaster: {
    open: boolean;
    id?: string;
  },
  area: {
    open: boolean;
    id?: string;
  },
  dorm: {
    open: boolean;
    id?: string;
  },
  user: {
    open: boolean;
    id?: string;
  },
  openPermission: {
    open: boolean;
    id?: string;
  },
  permissionDetail: {
    open: boolean;
    id?: string;
  },
  permissionComeback: {
    open: boolean;
    id?: string;
  },
  retireStudent: {
    open: boolean;
    id?: string;
  },
  dormHistory: {
    open: boolean;
    id?: string;
  },
  permissionHistory: {
    open: boolean;
    id?: string;
  },
};

export type DeletingStatusType = "idle" | "running" | "done" | "stopped"

export type DeletingType = {
  procedure: string[],
  masterItem: string[],
};

const initialStateForm: FormType = {
  branch: {
    open: false,
    id: undefined,
  },
  globalMaster: {
    open: false,
    id: undefined,
  },
  area: {
    open: false,
    id: undefined,
  },
  dorm: {
    open: false,
    id: undefined,
  },
  user: {
    open: false,
    id: undefined,
  },
  openPermission: {
    open: false,
    id: undefined,
  },
  permissionDetail: {
    open: false,
    id: undefined,
  },
  permissionComeback: {
    open: false,
    id: undefined,
  },
  retireStudent: {
    open: false,
    id: undefined,
  },
  dormHistory: {
    open: false,
    id: undefined,
  },
  permissionHistory: {
    open: false,
    id: undefined,
  },
}

const defaultDeleting: DeletingType = {
  procedure: [],
  masterItem: [],
}

export interface IAppPersistSlice {
  density: "compact" | "standard" | "comfortable";
  openMenu: OpenMenuType;
  setOpenMenu: (url: string, check?: boolean) => void;
  notificationMessage: string | null;
  setNotificationMessage: (message: string) => void;
  form: FormType,
  setFormOpen: ({ form, id }: { form: keyof FormType, id?: string }) => void,
  setFormClose: (form: keyof FormType) => void,
  deletingIds: DeletingType;
  setDeletingIds: (route: keyof DeletingType, ids: string[]) => void;
}

export const appPersistSlice: StateCreator<IAppPersistSlice> = (set) => ({
  density: "standard",
  openMenu: initialStateMenu,
  setOpenMenu: ((url, check) => set((state) => ({ ...state, openMenu: { ...state.openMenu, [url]: check === true ? (state.openMenu[url] ? true : !state.openMenu[url]) : !state.openMenu[url] } }))),
  form: initialStateForm,
  setFormOpen: (({ form, id }) => set(state => ({ ...state, form: { ...state.form, [form]: { open: true, id } } }))),
  setFormClose: ((form) => set(state => ({ ...state, form: ({ ...state.form, [form]: { open: false, id: undefined } }) }))),
  notificationMessage: null,
  setNotificationMessage: ((message) => set(state => ({ ...state, message: message }))),
  deletingIds: defaultDeleting,
  setDeletingIds: ((route, ids) => set((state) => ({ ...state, deletingIds: ({ ...state.deletingIds, [route]: ids }) }))),
});