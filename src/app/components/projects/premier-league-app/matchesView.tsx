"use client";

import { useState, useEffect } from "react";
import { Competition, Match } from "@/app/types/projectTypes";
import { formatMatchDate } from "@/app/utils/utils";

export default function MatchesView({
  competition,
  matches,
}: {
  competition: Competition;
  matches: Match[];
}) {
  const [currentMatchday, setCurrentMatchday] = useState<number | null>(null);

  useEffect(() => {
    if (competition) {
      setCurrentMatchday(competition.currentMatchday);
    }
  }, [competition]);

  const handlePrevMatchday = () => {
    if (currentMatchday && currentMatchday > 1) {
      setCurrentMatchday(currentMatchday - 1);
    }
  };

  const handleNextMatchday = () => {
    if (currentMatchday && matches) {
      const maxMatchday = Math.max(...matches.map((match) => match.matchday));
      if (currentMatchday < maxMatchday) {
        setCurrentMatchday(currentMatchday + 1);
      }
    }
  };

  const handleShowCurrentMatchday = () => {
    if (competition) {
      setCurrentMatchday(competition.currentMatchday);
    }
  };

  const filteredMatches = matches.filter(
    (match) => match.matchday === currentMatchday
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <img
            src={competition?.flag}
            alt={`${competition?.name} flag`}
            className="w-12 h-12 mr-4"
          />
          <h1 className="text-3xl font-bold">
            {competition?.name} Season {competition?.season}/
            {parseInt(competition?.season) + 1} Fixtures
          </h1>
        </div>
        <img
          src={competition?.emblem}
          alt={`${competition?.name} emblem`}
          className="w-24 h-24"
        />
      </div>
      <div className="mb-4 flex justify-center">
        <button
          onClick={handlePrevMatchday}
          disabled={currentMatchday === 1}
          className="btn bg-slate-700 text-slate-50 px-4 py-2 mx-1 disabled:bg-slate-900 hover:text-lime-500 disabled:hover:text-slate-50"
        >
          Previous Matchday
        </button>
        <button
          onClick={handleShowCurrentMatchday}
          className="btn bg-slate-700 text-slate-50 px-4 py-2 mx-1 disabled:bg-slate-900 hover:text-lime-500 disabled:hover:text-slate-50"
        >
          Current Matchday
        </button>
        <button
          onClick={handleNextMatchday}
          disabled={
            currentMatchday ===
            Math.max(...matches.map((match) => match.matchday))
          }
          className="btn bg-slate-700 text-slate-50 px-4 py-2 mx-1 disabled:bg-slate-900 hover:text-lime-500 disabled:hover:text-slate-50"
        >
          Next Matchday
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Matchday {currentMatchday} Fixtures
        </h2>
        {filteredMatches.length > 0 ? (
          <table className="w-full table-auto border-collapse text-center">
            <thead className="bg-slate-800 text-slate-50">
              <tr className="border border-slate-700">
                <th className="w-1/6 px-2 py-1">Date</th>
                <th className="w-2/6 px-2 py-1"></th>
                <th className="w-1/12 px-2 py-1">Fixture</th>
                <th className="w-2/6 px-2 py-1"></th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 text-slate-50 border border-slate-700">
              {filteredMatches.map((match, index) => (
                <tr
                  key={index}
                  className="border border-slate-700 hover:bg-slate-800 h-12 border-slate-700"
                >
                  <td className="px-2 py-1">{formatMatchDate(match.date)}</td>
                  <td className="px-2 py-1">
                    <div className="flex items-center justify-end">
                      <span>{match.homeTeam.name}</span>
                      <img
                        src={match.homeTeam.crest}
                        alt={`${match.homeTeam.name} crest`}
                        className="w-6 h-6 ml-2"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </td>
                  <td className="px-2 py-1">
                    <div className="flex items-center justify-start">
                      <img
                        src={match.awayTeam.crest}
                        alt={`${match.awayTeam.name} crest`}
                        className="w-6 h-6 mr-2"
                      />
                      <span>{match.awayTeam.name}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-slate-50">
            No matches found for this matchweek
          </div>
        )}
      </div>
    </div>
  );
}
