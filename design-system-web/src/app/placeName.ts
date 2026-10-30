import { toTraditional } from "./traditional";

/**
 * Place names in Taiwan usage. The web has no Apple Maps data (the native app
 * uses MapKit, already localized), so names from OpenStreetMap / Open-Meteo are
 * cleaned up here: pick the Traditional variant, convert any Simplified
 * characters, then swap mainland renderings for the Taiwan ones.
 */

/** Mainland rendering (written Simplified, converted at load) → Taiwan usage.
 *  Matched against a whole name component only, so 马里 never touches 马里兰州. */
const MAINLAND_TO_TW: [string, string][] = [
  // countries / regions
  ["澳大利亚", "澳洲"], ["新西兰", "紐西蘭"], ["意大利", "義大利"], ["朝鲜", "北韓"],
  ["大韩民国", "韓國"], ["韩国", "韓國"], ["沙特阿拉伯", "沙烏地阿拉伯"],
  ["阿拉伯联合酋长国", "阿拉伯聯合大公國"], ["卡塔尔", "卡達"], ["也门", "葉門"],
  ["老挝", "寮國"], ["文莱", "汶萊"], ["马尔代夫", "馬爾地夫"], ["毛里求斯", "模里西斯"],
  ["肯尼亚", "肯亞"], ["尼日利亚", "奈及利亞"], ["索马里", "索馬利亞"], ["坦桑尼亚", "坦尚尼亞"],
  ["赞比亚", "尚比亞"], ["津巴布韦", "辛巴威"], ["莫桑比克", "莫三比克"], ["博茨瓦纳", "波札那"],
  ["卢旺达", "盧安達"], ["乍得", "查德"], ["马里", "馬利"], ["加纳", "迦納"], ["贝宁", "貝南"],
  ["塞拉利昂", "獅子山"], ["埃塞俄比亚", "衣索比亞"], ["科特迪瓦", "象牙海岸"], ["加蓬", "加彭"],
  ["突尼斯", "突尼西亞"], ["危地马拉", "瓜地馬拉"], ["洪都拉斯", "宏都拉斯"],
  ["哥斯达黎加", "哥斯大黎加"], ["伯利兹", "貝里斯"], ["圭亚那", "蓋亞那"], ["苏里南", "蘇利南"],
  ["厄瓜多尔", "厄瓜多"], ["多米尼加", "多明尼加"], ["巴哈马", "巴哈馬"],
  ["克罗地亚", "克羅埃西亞"], ["塞尔维亚", "塞爾維亞"], ["黑山", "蒙特內哥羅"],
  ["斯洛文尼亚", "斯洛維尼亞"], ["格鲁吉亚", "喬治亞"], ["阿塞拜疆", "亞塞拜然"],
  ["哈萨克斯坦", "哈薩克"], ["乌兹别克斯坦", "烏茲別克"], ["吉尔吉斯斯坦", "吉爾吉斯"],
  ["塔吉克斯坦", "塔吉克"], ["土库曼斯坦", "土庫曼"], ["塞浦路斯", "賽普勒斯"],
  ["叙利亚", "敘利亞"], ["巴布亚新几内亚", "巴布亞紐幾內亞"], ["瓦努阿图", "萬那杜"],
  ["所罗门群岛", "索羅門群島"], ["汤加", "東加"], ["帕劳", "帛琉"], ["瑙鲁", "諾魯"],
  ["图瓦卢", "吐瓦魯"], ["孟加拉国", "孟加拉"], ["台湾", "臺灣"],
  // cities
  ["悉尼", "雪梨"], ["布里斯班", "布里斯本"], ["珀斯", "伯斯"], ["阿德莱德", "阿得雷德"],
  ["堪培拉", "坎培拉"], ["惠灵顿", "威靈頓"], ["巴塞罗那", "巴塞隆納"], ["佛罗伦萨", "佛羅倫斯"],
  ["那不勒斯", "拿坡里"], ["伊斯坦布尔", "伊斯坦堡"], ["迪拜", "杜拜"], ["阿布扎比", "阿布達比"],
  ["利雅得", "利雅德"], ["内罗毕", "奈洛比"], ["约翰内斯堡", "約翰尼斯堡"], ["巴厘岛", "峇里島"],
  ["宿务", "宿霧"], ["万象", "永珍"], ["首尔", "首爾"], ["首尔特别市", "首爾"],
  ["符拉迪沃斯托克", "海參崴"], ["圣地亚哥", "聖地牙哥"], ["菲尼克斯", "鳳凰城"],
  ["休斯敦", "休士頓"], ["新奥尔良", "紐奧良"], ["圣何塞", "聖荷西"], ["蒙特利尔", "蒙特婁"],
  ["卡尔加里", "卡加利"], ["埃德蒙顿", "艾德蒙頓"], ["大伦敦", "倫敦"],
  // US states
  ["加利福尼亚州", "加州"], ["得克萨斯州", "德州"], ["德克萨斯州", "德州"], ["俄勒冈州", "奧勒岡州"],
  ["俄克拉何马州", "奧克拉荷馬州"], ["艾奥瓦州", "愛荷華州"], ["亚拉巴马州", "阿拉巴馬州"],
  ["佐治亚州", "喬治亞州"], ["弗吉尼亚州", "維吉尼亞州"], ["西弗吉尼亚州", "西維吉尼亞州"],
  ["特拉华州", "德拉瓦州"], ["宾夕法尼亚州", "賓州"], ["新泽西州", "紐澤西州"],
  ["康涅狄格州", "康乃狄克州"], ["罗得岛州", "羅德島州"], ["马萨诸塞州", "麻州"],
  ["新罕布什尔州", "新罕布夏州"], ["密歇根州", "密西根州"], ["伊利诺伊州", "伊利諾州"],
  // Canadian provinces
  ["艾伯塔省", "亞伯達省"], ["艾伯塔", "亞伯達省"], ["阿尔伯塔省", "亞伯達省"],
  ["不列颠哥伦比亚省", "卑詩省"], ["不列颠哥伦比亚", "卑詩省"], ["新斯科舍省", "新斯科細亞省"],
  ["新斯科舍", "新斯科細亞省"], ["新不伦瑞克省", "新伯倫瑞克省"],
];

let table: Map<string, string> | null = null;

/** Whole-component lookup: 「得克薩斯州」→「德州」. */
function twTerm(component: string): string {
  table ??= new Map(MAINLAND_TO_TW.map(([cn, tw]) => [toTraditional(cn), tw]));
  return table.get(component) ?? component;
}

/** Labels that must not appear for Taiwan places (Open-Meteo admin data). */
const DROP = /^(?:臺灣省|台灣省|中國臺北|中國台北)|省 or /;

/** OSM names can list variants: 「纽约;紐約」「东京都/東京都」 — keep the Traditional one. */
function pickVariant(raw: string): string {
  const variants = raw.split(/[;/]/).map((v) => v.trim()).filter(Boolean);
  return variants.find((v) => toTraditional(v) === v) ?? variants[variants.length - 1] ?? raw;
}

/** One name component in Taiwan usage, or "" when it should be dropped. */
export function twPlacePart(raw: string | undefined): string {
  if (!raw) return "";
  const v = toTraditional(pickVariant(raw));
  if (DROP.test(v)) return "";
  return twTerm(v);
}

/** 「place, region」 in Taiwan usage; the region is skipped when empty or repeated. */
export function twPlaceName(place: string, region?: string): string {
  const p = twPlacePart(place);
  const r = twPlacePart(region);
  return r && r !== p ? `${p}, ${r}` : p;
}

/** Re-normalize an already-joined saved name such as 「東京, 东京都」. */
export function twSavedName(name: string): string {
  const parts = name.split(/,\s*/).map(twPlacePart).filter(Boolean);
  return [...new Set(parts)].join(", ") || name;
}
