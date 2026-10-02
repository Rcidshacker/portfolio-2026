import { WorldCore } from "./core";
import type { Band, Quality } from "./world";

export type Req =
  | { t: "init"; seed: number; quality: Quality }
  | { t: "bake"; id: number; band: Band; seg: number; scale: number }
  | { t: "svgs"; id: number; ids: string[] };

const post = self as unknown as { postMessage: (m: unknown, transfer?: Transferable[]) => void };
let core: WorldCore | null = null;

self.onmessage = (e: MessageEvent<Req>) => {
  const m = e.data;
  if (m.t === "init") {
    core = new WorldCore(m.seed, m.quality);
    post.postMessage({ t: "ready", meta: core.meta() });
  } else if (core && m.t === "bake") {
    const bmp = core.bake(m.band, m.seg, m.scale) as ImageBitmap;
    post.postMessage({ t: "baked", id: m.id, bmp }, [bmp]);
  } else if (core && m.t === "svgs") {
    post.postMessage({ t: "svgs", id: m.id, svgs: core.svgs(m.ids) });
  }
};
