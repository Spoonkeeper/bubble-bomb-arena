import { HEROES } from "../config.js";

const heroIds = () => HEROES.map((hero) => hero.id);

export const DEFAULT_MATCH_CONFIG = {
  playerCount: 1,
  aiCount: 3,
  playerHeroes: [HEROES[0].id],
};

export function normalizeMatchConfig(config = {}) {
  const playerCount = Number(config.playerCount) === 2 ? 2 : 1;
  const minAi = playerCount === 1 ? 1 : 0;
  const maxAi = 4 - playerCount;
  const requestedAi = Number.isFinite(Number(config.aiCount)) ? Number(config.aiCount) : maxAi;
  const aiCount = Math.max(minAi, Math.min(maxAi, Math.floor(requestedAi)));
  const validIds = heroIds();
  const first = validIds.includes(config.playerHeroes?.[0]) ? config.playerHeroes[0] : validIds[0];
  const playerHeroes = [first];

  if (playerCount === 2) {
    const requestedSecond = config.playerHeroes?.[1];
    const second = validIds.includes(requestedSecond) && requestedSecond !== first
      ? requestedSecond
      : validIds.find((id) => id !== first);
    playerHeroes.push(second);
  }

  return { playerCount, aiCount, playerHeroes };
}

export function matchConfigWith(config, changes) {
  return normalizeMatchConfig({ ...config, ...changes });
}
