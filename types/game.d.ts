type NotePosition = 1 | 2 | 3 | 4 | 5;
type SongName = ExtractKeys<ReplicatedFirst["Assets"]["Songs"], SongData>;

interface SongParts {
  Drums: Model;
  Lead: Model;
  Vocals: Model;
  Bass: Model;
}

interface SongData extends Folder {
  Audio: Sound;
  Cover: ImageLabel;
  Parts: Folder & {
    Hard: Folder & SongParts;
    Expert: Folder & SongParts;
    Medium: Folder & SongParts;
    Easy: Folder & SongParts;
  };
}