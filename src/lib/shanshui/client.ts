import { WorldCore, type Baked } from "./core";
import type { Band, EntityMeta, Quality } from "./world";
import type { Req } from "./worker";

type Job = Req extends infer R ? (R extends { id: number } ? Omit<R, "id"> : never) : never;

/** Same surface whether the work runs in a Web Worker or (fallback) on the main thread. */
export interface WorldClient {
  meta: Promise<EntityMeta[]>;
  bake(band: Band, seg: number, scale: number): Promise<Baked>;
  svgs(ids: string[]): Promise<Record<string, string>>;
  dispose(): void;
}

export function createWorld(seed: number, quality: Quality): WorldClient {
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return mainThread(seed, quality);

  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  let n = 0;
  const pending = new Map<number, (v: never) => void>();
  let onReady: (m: EntityMeta[]) => void = () => {};
  const meta = new Promise<EntityMeta[]>((r) => (onReady = r));
  worker.onmessage = (e: MessageEvent) => {
    const d = e.data;
    if (d.t === "ready") onReady(d.meta);
    else pending.get(d.id)?.(((d.t === "baked" ? d.bmp : d.svgs) as never));
    if (d.id !== undefined) pending.delete(d.id);
  };
  const send = <T,>(req: Job) =>
    new Promise<T>((res) => {
      const id = n++;
      pending.set(id, res as (v: never) => void);
      worker.postMessage({ ...req, id });
    });
  worker.postMessage({ t: "init", seed, quality } satisfies Req);
  return {
    meta,
    bake: (band, seg, scale) => send<Baked>({ t: "bake", band, seg, scale }),
    svgs: (ids) => send<Record<string, string>>({ t: "svgs", ids }),
    dispose: () => worker.terminate(),
  };
}

function mainThread(seed: number, quality: Quality): WorldClient {
  // Yield a frame between jobs so a slow bake doesn't freeze input.
  const tick = () => new Promise<void>((r) => setTimeout(r, 0));
  const core = new Promise<WorldCore>((r) => tick().then(() => r(new WorldCore(seed, quality))));
  return {
    meta: core.then((c) => c.meta()),
    bake: async (band, seg, scale) => (await tick(), (await core).bake(band, seg, scale)),
    svgs: async (ids) => (await core).svgs(ids),
    dispose: () => {},
  };
}
