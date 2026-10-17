import downCoat from "../../assets/garment/down-coat.svg?url";
import hoodedJacket from "../../assets/garment/hooded-jacket.svg?url";
import hoodie from "../../assets/garment/hoodie.svg?url";
import knit from "../../assets/garment/knit.svg?url";
import lightJacket from "../../assets/garment/light-jacket.svg?url";
import longSleeve from "../../assets/garment/long-sleeve.svg?url";
import noJacket from "../../assets/garment/no-jacket.svg?url";
import shortSleeve from "../../assets/garment/short-sleeve.svg?url";
import thickJacket from "../../assets/garment/thick-jacket.svg?url";
import vest from "../../assets/garment/vest.svg?url";
import waterproof from "../../assets/garment/waterproof.svg?url";

/** Garment label → real Figma icon SVG (node 226:3150). */
export const garmentIcon: Record<string, string> = {
  短袖上衣: shortSleeve,
  背心無袖: vest,
  長袖上衣: longSleeve,
  "襯衫（單穿）": longSleeve,
  "針織衫（單穿）": knit,
  "帽T衛衣（單穿）": hoodie,
  不加外套: noJacket,
  薄外套: lightJacket,
  連帽外套: hoodedJacket,
  厚外套夾克: thickJacket,
  羽絨外套大衣: downCoat,
  厚外套: thickJacket,
  防風防水外套: waterproof,
};
