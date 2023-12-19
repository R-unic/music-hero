export default interface SongScoreTable {
  readonly starsProgress: number,
  readonly points: number;
  readonly goodNotes: number;
  readonly perfectNotes: number;
  readonly missedNotes: number
}