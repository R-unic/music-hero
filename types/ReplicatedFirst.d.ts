interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    UI: Folder & {
      Particles: Folder & {
        Sparkles: ParticleEmitter;
        Sparks: ParticleEmitter;
      }
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