import { create } from "zustand";
import { persist } from "zustand/middleware";

// UI store with Zustand
const useUiStore = create(
  persist(
    (set) => ({
      // Sidebar state
      sidebarOpen: false,
      sidebarExpanded: false,
      expandedNav: null,

      // Theme state
      theme: "light",

      // Modal states
      activeModal: null,
      modalData: null,

      // Toast notifications
      toasts: [],

      // Bulk upload job status (persists across page navigation)
      bulkJob: null,

      // Actions

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarExpanded: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      toggleNav: (label) =>
        set((state) => ({
          expandedNav: state.expandedNav === label ? null : label,
        })),

      // Theme actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      // Modal actions
      openModal: (modalName, data = null) =>
        set({
          activeModal: modalName,
          modalData: data,
        }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Toast actions
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now(), ...toast }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Bulk job actions
      setBulkJob: (job) => set({ bulkJob: job }),
      clearBulkJob: () => set({ bulkJob: null }),
    }),
    {
      name: "ui-storage", // name for the localStorage key
      partialize: (state) => ({
        theme: state.theme,
        sidebarExpanded: state.sidebarExpanded,
        bulkJob: state.bulkJob,
      }), // only persist these fields
    }
  )
);

// Selectors
export const selectSidebarOpen = (state) => state.sidebarOpen;
export const selectSidebarExpanded = (state) => state.sidebarExpanded;
export const selectExpandedNav = (state) => state.expandedNav;
export const selectTheme = (state) => state.theme;
export const selectActiveModal = (state) => state.activeModal;
export const selectModalData = (state) => state.modalData;
export const selectToasts = (state) => state.toasts;
export const selectBulkJob = (state) => state.bulkJob;

export default useUiStore;
