interface SongParts {
  Drums: Model;
  Lead: Model;
  Vocals: Model;
  Bass: Model;
}

interface SongData extends Folder {
  Audio: Sound;
  Parts: Folder & {
    Hard: Folder & SongParts;
    Expert: Folder & SongParts;
    Medium: Folder & SongParts;
    Easy: Folder & SongParts;
  };
}