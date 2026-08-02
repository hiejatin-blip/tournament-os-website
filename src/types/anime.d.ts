/**
 * Ambient type declarations for `animejs` (the frozen boot sequence's animation
 * engine). animejs@3.2.2 ships no type definitions; this covers exactly the
 * API surface used by `components/boot/HaloBootPhase.tsx` (FROZEN — we declare
 * types around it rather than modifying it).
 */
declare module "animejs/lib/anime.es.js" {
  interface AnimeAnimParams {
    [key: string]: any;
  }

  function anime(params: AnimeAnimParams): anime.AnimeInstance;

  namespace anime {
    interface AnimeAnimParams {
      [key: string]: any;
    }

    interface AnimeTimelineInstance {
      add(params: AnimeAnimParams, offset?: string | number): AnimeTimelineInstance;
      play(): void;
      pause(): void;
      seek(time: number): void;
      restart(): void;
      reverse(): void;
      completed: boolean;
      duration: number;
    }

    interface AnimeInstance {
      play(): void;
      pause(): void;
      seek(time: number): void;
      restart(): void;
      reverse(): void;
      completed: boolean;
      duration: number;
    }

    function timeline(params?: AnimeAnimParams): AnimeTimelineInstance;
    function set(targets: unknown, params: AnimeAnimParams): void;
    function stagger(
      value: number | string | Array<number | string>,
      options?: Record<string, unknown>,
    ): unknown;
    function remove(targets: unknown): void;
    function get(targets: unknown, prop: string): unknown;
  }

  export = anime;
}
