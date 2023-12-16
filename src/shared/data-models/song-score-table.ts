export default interface SongScoreTable {
  readonly stars: 0 | 1 | 2 | 3 | 4 | 5,
  readonly points: number;
  readonly goodNotes: number;
  readonly perfectNotes: number;
  readonly missedNotes: number
}