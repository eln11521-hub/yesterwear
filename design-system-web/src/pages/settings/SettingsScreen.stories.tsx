import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";

import type { LocationMode, TempUnit } from "../../app/useSettingsStore";
import type { GeoLocation } from "../../app/weatherApi";
import { SettingsScreen } from "./SettingsScreen";

const wrap = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
    }}
  >
    <Story />
  </div>
);

function Stateful({ mode }: { mode: LocationMode }) {
  const [leave, setLeave] = useState("08:00");
  const [ret, setRet] = useState("18:00");
  const [m, setM] = useState<LocationMode>(mode);
  const [loc, setLoc] = useState<GeoLocation>({
    name: "台北",
    lat: 25.033,
    lon: 121.5654,
  });
  const [unit, setUnit] = useState<TempUnit>("C");
  const [notif, setNotif] = useState(true);
  const [leaveAlert, setLeaveAlert] = useState<string | undefined>();
  const [returnAlert, setReturnAlert] = useState<string | undefined>();
  const [evening, setEvening] = useState(true);
  const [eveningTime, setEveningTime] = useState("21:30");
  return (
    <SettingsScreen
      leaveTime={leave}
      returnTime={ret}
      locationMode={m}
      location={loc}
      onLeaveChange={setLeave}
      onReturnChange={setRet}
      onModeChange={setM}
      onLocationChange={setLoc}
      unit={unit}
      onUnitChange={setUnit}
      notifCommute={notif}
      onNotifCommuteChange={setNotif}
      leaveAlert={leaveAlert}
      returnAlert={returnAlert}
      onLeaveAlertChange={setLeaveAlert}
      onReturnAlertChange={setReturnAlert}
      notifEvening={evening}
      onNotifEveningChange={setEvening}
      eveningTime={eveningTime}
      onEveningTimeChange={setEveningTime}
      onNotifPermissionGranted={() => {
        setNotif(true);
        setEvening(true);
      }}
    />
  );
}

const meta = {
  title: "Pages/Settings",
  component: SettingsScreen,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [wrap],
} satisfies Meta<typeof SettingsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** GPS 自動定位 mode (default). */
export const Default: Story = { render: () => <Stateful mode="gps" /> };

/** 手動輸入城市 mode — try searching a city (live geocoding). */
export const ManualCity: Story = { render: () => <Stateful mode="manual" /> };
