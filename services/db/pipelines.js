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

export const topSongsPipeline = (username, earliest, latest, limit) => [
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

export const topArtistsPipeline = (username, earliest, latest, limit) => [
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
          artist: "$song.artist",
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

export const topGenresPipeline = (username, earliest, latest, limit) => [
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
    '$group': {
      '_id': '$song.artist', 
      'plays': {
        '$sum': 1
      }
    }
  }, {
    '$lookup': {
      'from': 'artists', 
      'localField': '_id', 
      'foreignField': 'artist', 
      'as': 'meta'
    }
  }, {
    '$unwind': {
      'path': '$meta', 
      'preserveNullAndEmptyArrays': false
    }
  }, {
    '$project': {
      'plays': 1, 
      'genre': '$meta.genres', 
      '_id': 0
    }
  }, {
    '$unwind': {
      'path': '$genre', 
      'preserveNullAndEmptyArrays': false
    }
  }, {
    '$group': {
      '_id': '$genre', 
      'plays': {
        '$sum': '$plays'
      }
    }
  }, {
    '$sort': {
      'plays': -1
    }
  }, {
    '$limit': limit
  }
]

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

export const allUsernames = [
  {
    $group: {
      _id: '$username'
    }
  }
]