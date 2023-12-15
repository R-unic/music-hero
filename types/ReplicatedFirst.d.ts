interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    UI: Folder & {
      SongCard: ImageButton & {
        Title: TextLabel & {
          UIStroke: UIStroke;
        };
      };
    };
    Songs: Folder & {
      ["Paradise Falls"]: SongData;
    };
  };
}