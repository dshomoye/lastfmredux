export const dailyPlaysCountPipeline = (username, earliest, latest) => {
  return [
    {
      $match: {
        username: username,
        time: {
          $gte: earliest,
          $lte: latest,
        },
      },
    },
    {
      $project: {
        date: {
          $dateToString: {
            date: "$time",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $group: {
        _id: {
          date: "$date",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ];
};

export const topSongsPipeline = (username, earliest, latest, limit) => {
  return [
    {
      $match: {
        username: username,
        time: {
          $gte: earliest,
          $lte: latest,
        },
      },
    },
    {
      $group: {
        _id: {
          title: "$song.title",
          artist: "$song.artist",
          album: "$song.album",
        },
        plays: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        plays: -1,
      },
    },
    {
      $limit: limit,
    },
  ];
};

export const allScrobbleArtistsPipeline = (latest) => [
  {
    $match: {
      time: {
        $gte: latest,
      },
    },
  },
  {
    $group: {
      _id: {
        artist: "$song.artist",
      },
      song: {
        $first: "$song",
      },
    },
  },
];
