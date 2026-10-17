import gearUrl from "../../assets/nav/gear.svg?url";
import thermometerUrl from "../../assets/nav/thermometer.svg?url";
import { Icon } from "../_ui/Icon";

/** Nav icons — real Figma SVGs (174:210 thermometer, 174:214 gear) via mask/currentColor. */

export function ThermometerIcon({ size = 20 }: { size?: number }) {
  return <Icon src={thermometerUrl} size={size} />;
}

export function GearIcon({ size = 20 }: { size?: number }) {
  return <Icon src={gearUrl} size={size} />;
}
