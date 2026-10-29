import beanie from "../../assets/garment/beanie.svg?url";
import blazer from "../../assets/garment/blazer.svg?url";
import cap from "../../assets/garment/cap.svg?url";
import downCoat from "../../assets/garment/down-coat.svg?url";
import gloves from "../../assets/garment/gloves.svg?url";
import hoodedJacket from "../../assets/garment/hooded-jacket.svg?url";
import hoodie from "../../assets/garment/hoodie.svg?url";
import jeans from "../../assets/garment/jeans.svg?url";
import knit from "../../assets/garment/knit.svg?url";
import lightJacket from "../../assets/garment/light-jacket.svg?url";
import longSkirt from "../../assets/garment/long-skirt.svg?url";
import longSleeve from "../../assets/garment/long-sleeve.svg?url";
import noJacket from "../../assets/garment/no-jacket.svg?url";
import polo from "../../assets/garment/polo.svg?url";
import pufferVest from "../../assets/garment/puffer-vest.svg?url";
import scarf from "../../assets/garment/scarf.svg?url";
import shirt from "../../assets/garment/shirt.svg?url";
import shortSleeve from "../../assets/garment/short-sleeve.svg?url";
import shorts from "../../assets/garment/shorts.svg?url";
import skirt from "../../assets/garment/skirt.svg?url";
import sunglasses from "../../assets/garment/sunglasses.svg?url";
import thermal from "../../assets/garment/thermal.svg?url";
import thermalPants from "../../assets/garment/thermal-pants.svg?url";
import thickJacket from "../../assets/garment/thick-jacket.svg?url";
import trousers from "../../assets/garment/trousers.svg?url";
import turtleneck from "../../assets/garment/turtleneck.svg?url";
import umbrella from "../../assets/garment/umbrella.svg?url";
import vest from "../../assets/garment/vest.svg?url";
import waterproof from "../../assets/garment/waterproof.svg?url";
import woolCoat from "../../assets/garment/wool-coat.svg?url";

/** Garment label → line icon SVG (Figma 226:3150 + the multi-select set). */
export const garmentIcon: Record<string, string> = {
  // 上身
  短袖上衣: shortSleeve,
  背心無袖: vest,
  Polo衫: polo,
  長袖上衣: longSleeve,
  襯衫: shirt,
  針織衫: knit,
  帽T衛衣: hoodie,
  高領毛衣: turtleneck,
  發熱衣: thermal,
  // 外套 / 疊搭
  不加外套: noJacket,
  薄外套: lightJacket,
  連帽外套: hoodedJacket,
  西裝外套: blazer,
  鋪棉背心: pufferVest,
  厚外套夾克: thickJacket,
  厚外套: thickJacket,
  毛呢大衣: woolCoat,
  羽絨外套: downCoat,
  防風防水外套: waterproof,
  // 下身
  短褲: shorts,
  短裙: skirt,
  長裙: longSkirt,
  長褲: trousers,
  牛仔褲: jeans,
  保暖褲: thermalPants,
  // 配件
  帽子: cap,
  毛帽: beanie,
  圍巾: scarf,
  手套: gloves,
  雨傘: umbrella,
  墨鏡: sunglasses,
};
