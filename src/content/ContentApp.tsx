import React from "react";

export default function ContentApp() {
  const [loading, setLoading] = React.useState<boolean>(true);
  function extractValueFromElement(
    element: Element | null,
    customSplitter?: string,
  ): number | null {
    if (!element) return null;

    let countString = "";
    if (customSplitter) {
      countString = element.innerHTML
        .split(customSplitter)[0]
        .replaceAll('"', "")
        .trim();
    } else {
      countString = element.innerHTML.trim();
    }
    const parsedCount = parseFloat(countString);
    if (isNaN(parsedCount)) return null;

    return parsedCount;
  }

  async function findStatWithLabel(label: string): Promise<number | null> {
    let statCount: number | null = null;

    await Promise.all(
      document
        .querySelectorAll("div.stat")
        .entries()
        .map(([_, element]) => {
          if (element.classList.length === 1) {
            const labelElement = element.childNodes[0] as Element | undefined;
            if (!labelElement) return;
            if (labelElement.innerHTML !== label) return;

            statCount = extractValueFromElement(
              element.childNodes[1] as Element,
            );
          } else if (element.classList.length === 2) {
            const labelElement = element.childNodes[0] as Element | undefined;
            if (!labelElement) return;
            if (!labelElement.innerHTML.includes(label)) return;

            statCount = extractValueFromElement(
              element.childNodes[1] as Element,
            );
          } else {
            const labelElement = element.childNodes[0].childNodes[3]
              .childNodes[0] as Element | undefined;
            if (!labelElement) return;
            if (labelElement.innerHTML !== label) return;

            statCount = extractValueFromElement(
              element.childNodes[0].childNodes[3].childNodes[2]
                .childNodes[0] as Element,
            );
          }
        }),
    );
    return statCount;
  }
  const [smurfLikelihood, setSmurfLikelihood] = React.useState<number>(0);
  const [badges, setBadges] = React.useState<string[]>([]);
  React.useEffect(() => {
    async function func() {
      setLoading(true);
      const matches = extractValueFromElement(
        document.querySelector(".matches"),
      );
      const playtime = extractValueFromElement(
        document.querySelector(".playtime"),
        "h",
      );

      const level = await findStatWithLabel("Level");
      const damagePerRound = await findStatWithLabel("Damage/Round");
      const kd = await findStatWithLabel("K/D Ratio");
      const headshotRate = await findStatWithLabel("Headshot %");
      const winRate = await findStatWithLabel("Win %");
      const wins = await findStatWithLabel("Wins");
      const kast = await findStatWithLabel("KAST");
      const damageDeltaPerRound = await findStatWithLabel("DDΔ/Round");
      const kills = await findStatWithLabel("Kills");
      const deaths = await findStatWithLabel("Deaths");
      const assists = await findStatWithLabel("Assists");
      const acs = await findStatWithLabel("ACS");
      const kad = await findStatWithLabel("KAD Ratio");
      const killsPerRound = await findStatWithLabel("Kills/Round");
      const firstBloods = await findStatWithLabel("First Bloods");
      const flawlessRounds = await findStatWithLabel("Flawless Rounds");
      const aces = await findStatWithLabel("Aces");
      const roundWinRate = await findStatWithLabel("Round Win %");
      const rank =
        document
          .querySelector(".stat__value")
          ?.innerHTML.replace(" 1", "")
          .replace(" 2", "")
          .replace(" 3", "") ?? null;

      const trackerScore = parseInt(
        (
          document.querySelector(".score__text")?.childNodes[1] as Element
        ).innerHTML.split(" ")[0],
      );

      let totalScore = 0;
      const ranks: string[] = [
        "Unrated",
        "Iron",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Ascendant",
        "Immortal",
        "Radiant",
      ];
      if (level && rank) {
        const levelRankRatioValue = (50 * ranks.indexOf(rank)) / level;
        console.log(levelRankRatioValue);
        totalScore += levelRankRatioValue * 20;
        if (levelRankRatioValue >= 5)
          setBadges((prev) => [...prev, "Level is pretty low for this rank"]);
      }
      if (kd) {
        totalScore += kd * kd;
        if (kd > 1.4)
          setBadges((prev) => [
            ...prev,
            "The K/D ratio for this player is higher than normal.",
          ]);
      }
      if (trackerScore) {
        totalScore += trackerScore * 0.05;
        if (trackerScore > 900)
          setBadges((prev) => [
            ...prev,
            "The TrackerScore is pretty high. This player should quickly rank-up.",
          ]);
      }
      if (damagePerRound) {
        totalScore += damagePerRound - 180;
        if (damagePerRound > 200)
          setBadges((prev) => [
            ...prev,
            "This player deals more damage per round than normal players in this rank.",
          ]);
      }
      console.log(totalScore);
      const calcScore = totalScore / 200;
      if (calcScore <= 0) {
        setSmurfLikelihood(0.0);
      } else if (calcScore >= 1) {
        setSmurfLikelihood(1.0);
      } else {
        setSmurfLikelihood(calcScore);
      }
      setLoading(false);
    }
    func();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center gap-2 w-full">
        <div className="rounded-lg text-xs w-full bg-gray-500 py-1 px-2">
          Loading / Error
        </div>
        <div className="rounded-lg text-xs w-full bg-green-700 py-1 px-2">
          Unlikely
        </div>
        <div className="rounded-lg text-xs w-full bg-orange-500 py-1 px-2">
          Could be
        </div>
        <div className="rounded-lg text-xs w-full bg-red-700 py-1 px-2">
          Pretty likely
        </div>
      </div>
      <div
        className={
          "w-full rounded-lg p-4 flex flex-col gap-4 shadow-md shadow-white" +
          (smurfLikelihood === 0
            ? " bg-gray-500"
            : smurfLikelihood < 0.4
              ? " bg-green-700"
              : smurfLikelihood < 0.7
                ? " bg-orange-500"
                : " bg-red-700")
        }
      >
        <div className="flex flex-col gap-0">
          <h1 className="text-xl font-bold">Smurf-Detector Report</h1>
          <p className="text-white/70 text-sm">
            Results of this are no guarantee that a player is truly smurfing.
            People can always have a good game and sometimes they just shoot
            better. Please don't hate on other players, hate on the game.
          </p>
        </div>
        <div className="flex flex-row p-2 rounded-lg border border-dashed items-center justify-between gap-2 flex-wrap">
          <span className="italic">Likelihood of player being a smurf:</span>
          <span className="font-extrabold text-xl">
            {loading
              ? "Loading..."
              : `${Number(smurfLikelihood * 100).toFixed(2)}%`}
          </span>
        </div>
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {badges.map((badge) => (
            <div
              key={badge}
              className="border border-dashed border-white py-1 px-2 rounded-lg text-xs"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
