import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { defaultJson } from "src/constants/data";
import create from "zustand";

interface ConfigActions {
  getLanguage: () => string;
  setLanguage: (language: string) => void;
  setDocument: (document: string) => void;
  setConfig: (key: keyof Config, value: unknown) => void;
  getDocument: () => string;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

export interface Config {
  language: string;
  document: string;
  cursorMode: "move" | "navigation";
  layout: "LEFT" | "RIGHT" | "DOWN" | "UP";
  expand: boolean;
  hideEditor: boolean;
  zoomPanPinch?: ReactZoomPanPinchRef;
  performanceMode: boolean;
}

const initialStates: Config = {
  language: "json",
  document: defaultJson,
  cursorMode: "move",
  layout: "RIGHT",
  expand: true,
  hideEditor: false,
  performanceMode: true,
};

const useConfig = create<Config & ConfigActions>()((set, get) => ({
  ...initialStates,
  getLanguage: () => get().language,
  setLanguage: (language: string) => set({ language }),
  getDocument: () => get().document,
  setDocument: (document: string) => set({ document }),
  zoomIn: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale + 0.4
      );
    }
  },
  zoomOut: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale - 0.4
      );
    }
  },
  centerView: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) zoomPanPinch.centerView(0.6);
  },
  setConfig: (setting: keyof Config, value: unknown) => set({ [setting]: value }),
}));

export default useConfig;
