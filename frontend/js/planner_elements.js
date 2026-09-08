// PLANNER ELEMENTS

const plannerTheme = {
  primary: "#1E4E8C",
  gold: "#C9A86A",
  cream: "#F8F3EA",
  white: "#FFFFFF",
  lightBlue: "#EAF4FF",
  text: "#102A43",
  shadow: "rgba(30,78,140,0.22)",
  softShadow: "rgba(30,78,140,0.10)",
  green: "rgba(72,122,72,0.35)"
};

function createElementLabel(text, x, y) {
  return new Konva.Text({
    x: x,
    y: y,
    text: text,
    fontSize: 13,
    fontStyle: "bold",
    fill: plannerTheme.text
  });
}

function drawVenueBackground(stage, layer) {
  const hallX = 25;
  const hallY = 25;
  const hallWidth = stage.width() - 50;
  const hallHeight = stage.height() - 50;

  const backgroundName = "venueBackground";

  function addBackgroundNode(node) {
    node.name(backgroundName);
    node.listening(false);
    layer.add(node);
    return node;
  }

  
  // ОСНОВА И ВЪНШНА СЯНКА
  
  addBackgroundNode(
    new Konva.Rect({
      x: hallX,
      y: hallY + 10,
      width: hallWidth,
      height: hallHeight,
      cornerRadius: 30,
      fill: "rgba(16,42,67,0.12)",
      shadowColor: "rgba(16,42,67,0.20)",
      shadowBlur: 22,
      shadowOffset: {
        x: 0,
        y: 10
      }
    })
  );

  addBackgroundNode(
    new Konva.Rect({
      x: hallX,
      y: hallY,
      width: hallWidth,
      height: hallHeight,
      cornerRadius: 30,

      fillLinearGradientStartPoint: {
        x: hallX,
        y: hallY
      },

      fillLinearGradientEndPoint: {
        x: hallX + hallWidth,
        y: hallY + hallHeight
      },

      fillLinearGradientColorStops: [
        0, "#FCFEFF",
        0.42, "#EEF7FF",
        1, "#D9EAF8"
      ],

      stroke: "#B98D47",
      strokeWidth: 6
    })
  );

  // Двойна декоративна рамка
  addBackgroundNode(
    new Konva.Rect({
      x: hallX + 13,
      y: hallY + 13,
      width: hallWidth - 26,
      height: hallHeight - 26,
      cornerRadius: 25,
      stroke: "rgba(201,168,106,0.75)",
      strokeWidth: 2
    })
  );

  addBackgroundNode(
    new Konva.Rect({
      x: hallX + 22,
      y: hallY + 22,
      width: hallWidth - 44,
      height: hallHeight - 44,
      cornerRadius: 21,
      stroke: "rgba(255,255,255,0.95)",
      strokeWidth: 2
    })
  );

  // ГОРНА АРХИТЕКТУРНА СТЕНА
  
  const wallX = hallX + 28;
  const wallY = hallY + 24;
  const wallWidth = hallWidth - 56;
  const wallHeight = 92;

  addBackgroundNode(
    new Konva.Rect({
      x: wallX,
      y: wallY,
      width: wallWidth,
      height: wallHeight,
      cornerRadius: 18,

      fillLinearGradientStartPoint: {
        x: wallX,
        y: wallY
      },

      fillLinearGradientEndPoint: {
        x: wallX,
        y: wallY + wallHeight
      },

      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.58, "#F6F9FC",
        1, "#E5EDF5"
      ],

      stroke: "rgba(201,168,106,0.48)",
      strokeWidth: 2,
      shadowColor: "rgba(16,42,67,0.08)",
      shadowBlur: 8,
      shadowOffset: {
        x: 0,
        y: 3
      }
    })
  );

  // Корниз
  addBackgroundNode(
    new Konva.Rect({
      x: wallX + 8,
      y: wallY + wallHeight - 12,
      width: wallWidth - 16,
      height: 12,
      cornerRadius: 6,
      fillLinearGradientStartPoint: {
        x: wallX,
        y: 0
      },
      fillLinearGradientEndPoint: {
        x: wallX + wallWidth,
        y: 0
      },
      fillLinearGradientColorStops: [
        0, "#A97935",
        0.5, "#E0BD75",
        1, "#A97935"
      ]
    })
  );

  // ДЕКОРАТИВНИ СТЕННИ ПАНЕЛИ
  
  const wallPanels = [
    { x: 70, width: 170 },
    { x: 260, width: 160 },
    { x: 440, width: 150 },
    { x: 1110, width: 150 },
    { x: 1280, width: 160 },
    { x: 1460, width: 170 }
  ];

  wallPanels.forEach(panel => {
    addBackgroundNode(
      new Konva.Rect({
        x: panel.x,
        y: wallY + 13,
        width: panel.width,
        height: 58,
        cornerRadius: 8,
        fill: "rgba(255,255,255,0.72)",
        stroke: "rgba(128,149,172,0.30)",
        strokeWidth: 1.5
      })
    );

    addBackgroundNode(
      new Konva.Rect({
        x: panel.x + 8,
        y: wallY + 20,
        width: panel.width - 16,
        height: 44,
        cornerRadius: 6,
        stroke: "rgba(201,168,106,0.32)",
        strokeWidth: 1.2
      })
    );
  });

  // ПРОЗОРЦИ
  
  const windows = [
    { x: 285, width: 165 },
    { x: 610, width: 175 },
    { x: 915, width: 175 },
    { x: 1245, width: 165 }
  ];

  windows.forEach(windowData => {
    addBackgroundNode(
      new Konva.Rect({
        x: windowData.x,
        y: wallY + 8,
        width: windowData.width,
        height: 70,
        cornerRadius: 9,

        fillLinearGradientStartPoint: {
          x: windowData.x,
          y: wallY
        },

        fillLinearGradientEndPoint: {
          x: windowData.x,
          y: wallY + 78
        },

        fillLinearGradientColorStops: [
          0, "#F8FEFF",
          0.46, "#D7F0FC",
          1, "#A8CFE7"
        ],

        stroke: "#C9A86A",
        strokeWidth: 2,
        shadowColor: "rgba(30,78,140,0.12)",
        shadowBlur: 6
      })
    );

    const paneWidth = windowData.width / 4;

    for (let pane = 1; pane < 4; pane++) {
      addBackgroundNode(
        new Konva.Line({
          points: [
            windowData.x + paneWidth * pane,
            wallY + 10,
            windowData.x + paneWidth * pane,
            wallY + 76
          ],
          stroke: "rgba(75,119,160,0.34)",
          strokeWidth: 1
        })
      );
    }

    addBackgroundNode(
      new Konva.Line({
        points: [
          windowData.x + 2,
          wallY + 43,
          windowData.x + windowData.width - 2,
          wallY + 43
        ],
        stroke: "rgba(75,119,160,0.34)",
        strokeWidth: 1
      })
    );

    // Завеси
    addBackgroundNode(
      new Konva.Line({
        points: [
          windowData.x + 7,
          wallY + 8,
          windowData.x + 20,
          wallY + 34,
          windowData.x + 12,
          wallY + 72
        ],
        stroke: "rgba(196,204,228,0.85)",
        strokeWidth: 11,
        tension: 0.35,
        lineCap: "round"
      })
    );

    addBackgroundNode(
      new Konva.Line({
        points: [
          windowData.x + windowData.width - 7,
          wallY + 8,
          windowData.x + windowData.width - 20,
          wallY + 34,
          windowData.x + windowData.width - 12,
          wallY + 72
        ],
        stroke: "rgba(196,204,228,0.85)",
        strokeWidth: 11,
        tension: 0.35,
        lineCap: "round"
      })
    );

    addBackgroundNode(
      new Konva.Circle({
        x: windowData.x + 17,
        y: wallY + 41,
        radius: 4,
        fill: "#C9A86A"
      })
    );

    addBackgroundNode(
      new Konva.Circle({
        x: windowData.x + windowData.width - 17,
        y: wallY + 41,
        radius: 4,
        fill: "#C9A86A"
      })
    );
  });

  // СТЕННИ АПЛИЦИ
 
  const wallLights = [
    180,
    520,
    850,
    1180,
    1520
  ];

  wallLights.forEach(lightX => {
    addBackgroundNode(
      new Konva.Circle({
        x: lightX,
        y: wallY + 44,
        radius: 17,
        fill: "rgba(247,211,130,0.16)",
        shadowColor: "#F4D58A",
        shadowBlur: 18
      })
    );

    addBackgroundNode(
      new Konva.Rect({
        x: lightX - 3,
        y: wallY + 32,
        width: 6,
        height: 25,
        cornerRadius: 3,
        fill: "#B98D47"
      })
    );

    addBackgroundNode(
      new Konva.Circle({
        x: lightX - 8,
        y: wallY + 29,
        radius: 5,
        fill: "#F4D58A"
      })
    );

    addBackgroundNode(
      new Konva.Circle({
        x: lightX + 8,
        y: wallY + 29,
        radius: 5,
        fill: "#F4D58A"
      })
    );
  });

  // СВЕТЛОСИН МРАМОРЕН ПОД
  
  const floorX = hallX + 30;
  const floorY = wallY + wallHeight + 8;
  const floorWidth = hallWidth - 60;
  const floorHeight = hallHeight - wallHeight - 58;

  addBackgroundNode(
    new Konva.Rect({
      x: floorX,
      y: floorY,
      width: floorWidth,
      height: floorHeight,
      cornerRadius: 18,

      fillLinearGradientStartPoint: {
        x: floorX,
        y: floorY
      },

      fillLinearGradientEndPoint: {
        x: floorX + floorWidth,
        y: floorY + floorHeight
      },

      fillLinearGradientColorStops: [
        0, "#FBFDFF",
        0.34, "#EFF7FD",
        0.68, "#E3EFF9",
        1, "#D4E5F4"
      ],

      stroke: "rgba(98,140,178,0.30)",
      strokeWidth: 2
    })
  );

  // Мека светлина в центъра
  addBackgroundNode(
    new Konva.Ellipse({
      x: stage.width() / 2,
      y: floorY + floorHeight / 2,
      radiusX: 610,
      radiusY: 390,
      fillRadialGradientStartPoint: {
        x: 0,
        y: 0
      },
      fillRadialGradientStartRadius: 20,
      fillRadialGradientEndPoint: {
        x: 0,
        y: 0
      },
      fillRadialGradientEndRadius: 610,
      fillRadialGradientColorStops: [
        0, "rgba(255,255,255,0.36)",
        0.58, "rgba(235,246,255,0.12)",
        1, "rgba(204,226,244,0)"
      ]
    })
  );

  // МРАМОРНИ ПЛОЧИ

  const tileSize = 105;

  for (
    let tileX = floorX;
    tileX < floorX + floorWidth;
    tileX += tileSize
  ) {
    addBackgroundNode(
      new Konva.Line({
        points: [
          tileX,
          floorY,
          tileX,
          floorY + floorHeight
        ],
        stroke: "rgba(60,109,153,0.075)",
        strokeWidth: 1
      })
    );
  }

  for (
    let tileY = floorY;
    tileY < floorY + floorHeight;
    tileY += tileSize
  ) {
    addBackgroundNode(
      new Konva.Line({
        points: [
          floorX,
          tileY,
          floorX + floorWidth,
          tileY
        ],
        stroke: "rgba(60,109,153,0.075)",
        strokeWidth: 1
      })
    );
  }

  // МРАМОРНИ ЖИЛКИ

  const marbleVeins = [
    [
      floorX + 70, floorY + 105,
      floorX + 250, floorY + 135,
      floorX + 390, floorY + 90,
      floorX + 540, floorY + 128
    ],
    [
      floorX + 690, floorY + 75,
      floorX + 840, floorY + 135,
      floorX + 1020, floorY + 108,
      floorX + 1220, floorY + 150
    ],
    [
      floorX + 120, floorY + 390,
      floorX + 300, floorY + 350,
      floorX + 470, floorY + 415,
      floorX + 620, floorY + 375
    ],
    [
      floorX + 820, floorY + 410,
      floorX + 980, floorY + 360,
      floorX + 1160, floorY + 435,
      floorX + 1400, floorY + 390
    ],
    [
      floorX + 390, floorY + 650,
      floorX + 590, floorY + 610,
      floorX + 760, floorY + 675,
      floorX + 950, floorY + 630
    ]
  ];

  marbleVeins.forEach((points, index) => {
    addBackgroundNode(
      new Konva.Line({
        points,
        stroke: index % 2 === 0
          ? "rgba(104,149,190,0.12)"
          : "rgba(201,168,106,0.08)",
        strokeWidth: index % 2 === 0 ? 2 : 1.5,
        tension: 0.48,
        lineCap: "round"
      })
    );
  });

  
// ФЛОРАЛНИ КОМПОЗИЦИИ //

const floralPositions = [
  { x: 92, y: 160, flip: 1 },
  { x: 92, y: 915, flip: 1 },
  { x: 1608, y: 160, flip: -1 },
  { x: 1608, y: 915, flip: -1 }
];

floralPositions.forEach((position, arrangementIndex) => {
  const floralGroup = new Konva.Group({
    x: position.x,
    y: position.y,
    scaleX: position.flip,
    listening: false,
    name: backgroundName
  });

  // Мека сянка
  floralGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 26,
      radiusX: 42,
      radiusY: 10,
      fill: "rgba(16,42,67,0.11)"
    })
  );

  // Ниска елегантна саксия
  floralGroup.add(
    new Konva.Path({
      data: "M -27 4 L 27 4 L 20 30 Q 0 38 -20 30 Z",
      fillLinearGradientStartPoint: {
        x: -27,
        y: 4
      },
      fillLinearGradientEndPoint: {
        x: 27,
        y: 30
      },
      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.55, "#F6F0E5",
        1, "#DCC79F"
      ],
      stroke: "#C9A86A",
      strokeWidth: 2
    }),

    new Konva.Ellipse({
      x: 0,
      y: 5,
      radiusX: 27,
      radiusY: 7,
      fill: "#F8F3EA",
      stroke: "#C9A86A",
      strokeWidth: 1.5
    })
  );

  // Ниска зеленина, разперена настрани
  const leaves = [
    {
      x: -33,
      y: -8,
      radiusX: 27,
      radiusY: 8,
      rotation: -22,
      fill: "#6F8D68"
    },
    {
      x: 33,
      y: -8,
      radiusX: 27,
      radiusY: 8,
      rotation: 22,
      fill: "#7E9A73"
    },
    {
      x: -19,
      y: -22,
      radiusX: 24,
      radiusY: 7,
      rotation: -48,
      fill: "#829E78"
    },
    {
      x: 19,
      y: -22,
      radiusX: 24,
      radiusY: 7,
      rotation: 48,
      fill: "#91A987"
    },
    {
      x: 0,
      y: -29,
      radiusX: 23,
      radiusY: 7,
      rotation: 90,
      fill: "#78936F"
    },
    {
      x: -42,
      y: 5,
      radiusX: 21,
      radiusY: 7,
      rotation: -8,
      fill: "#8AA480"
    },
    {
      x: 42,
      y: 5,
      radiusX: 21,
      radiusY: 7,
      rotation: 8,
      fill: "#7A956F"
    }
  ];

  leaves.forEach(leaf => {
    floralGroup.add(
      new Konva.Ellipse({
        x: leaf.x,
        y: leaf.y,
        radiusX: leaf.radiusX,
        radiusY: leaf.radiusY,
        rotation: leaf.rotation,
        fill: leaf.fill,
        stroke: "rgba(67,101,65,0.22)",
        strokeWidth: 0.8
      })
    );
  });

  // Малки цветя с няколко венчелистчета
  const flowers = [
    {
      x: -27,
      y: -18,
      radius: 8,
      petal: "#FFF9ED",
      center: "#C99A4E"
    },
    {
      x: -8,
      y: -33,
      radius: 9,
      petal: "#F3DDB8",
      center: "#B9893F"
    },
    {
      x: 13,
      y: -30,
      radius: 8,
      petal: "#FFFFFF",
      center: "#C99A4E"
    },
    {
      x: 31,
      y: -14,
      radius: 9,
      petal: "#F0D2C4",
      center: "#B9893F"
    },
    {
      x: 1,
      y: -13,
      radius: 10,
      petal: "#FFF6E6",
      center: "#C08E3E"
    }
  ];

  flowers.forEach(flower => {
    const petalDistance = flower.radius * 0.72;
    const petalRadius = flower.radius * 0.56;

    for (let petalIndex = 0; petalIndex < 5; petalIndex++) {
      const angle =
        (Math.PI * 2 / 5) * petalIndex -
        Math.PI / 2;

      floralGroup.add(
        new Konva.Circle({
          x:
            flower.x +
            Math.cos(angle) * petalDistance,
          y:
            flower.y +
            Math.sin(angle) * petalDistance,
          radius: petalRadius,
          fill: flower.petal,
          stroke: "rgba(201,168,106,0.40)",
          strokeWidth: 0.7
        })
      );
    }

    floralGroup.add(
      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: flower.radius * 0.35,
        fill: flower.center
      })
    );
  });

  // Малки пъпки за естествен вид
  const buds = [
    { x: -44, y: -11 },
    { x: -20, y: -41 },
    { x: 25, y: -39 },
    { x: 45, y: -5 }
  ];

  buds.forEach((bud, budIndex) => {
    floralGroup.add(
      new Konva.Circle({
        x: bud.x,
        y: bud.y,
        radius: 4,
        fill:
          budIndex % 2 === 0
            ? "#F4DFBE"
            : "#FFF9ED",
        stroke: "#C9A86A",
        strokeWidth: 0.8
      })
    );
  });

  layer.add(floralGroup);
});

  // ФОНОВИТЕ ОБЕКТИ ОСТАВАТ НАЙ-ОТДОЛУ

  const backgroundNodes =
    layer.find(`.${backgroundName}`);

  for (
    let index = backgroundNodes.length - 1;
    index >= 0;
    index--
  ) {
    backgroundNodes[index].moveToBottom();
  }

  layer.draw();
}

// LUXURY TABLE HELPERS

function createLuxuryChair(x, y, rotation = 0) {
  const chair = new Konva.Group({
    x,
    y,
    rotation,
    listening: false
  });

  chair.add(
    // сянка
    new Konva.Rect({
      x: -13,
      y: -10,
      width: 26,
      height: 30,
      cornerRadius: 8,
      fill: "rgba(16,42,67,0.10)"
    }),

    // облегалка
    new Konva.Rect({
      x: -12,
      y: -15,
      width: 24,
      height: 15,
      cornerRadius: 7,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 2
    }),

    // седалка
    new Konva.Rect({
      x: -11,
      y: 0,
      width: 22,
      height: 20,
      cornerRadius: 6,
      fill: "#F8F0DF",
      stroke: "#C9A86A",
      strokeWidth: 2,
      shadowColor: "rgba(16,42,67,0.16)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      }
    }),

    // вътрешна тапицерия
    new Konva.Rect({
      x: -7,
      y: 4,
      width: 14,
      height: 11,
      cornerRadius: 4,
      fill: "#FFFFFF",
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1
    })
  );

  return chair;
}


function createFloralCenterpiece(x = 0, y = 0, scale = 1) {
  const flowers = new Konva.Group({
    x,
    y,
    scaleX: scale,
    scaleY: scale,
    listening: false
  });

  flowers.add(
    // зеленина
    new Konva.Ellipse({
      x: -13,
      y: 2,
      radiusX: 14,
      radiusY: 6,
      rotation: -30,
      fill: "#7D9A6D"
    }),

    new Konva.Ellipse({
      x: 13,
      y: 2,
      radiusX: 14,
      radiusY: 6,
      rotation: 30,
      fill: "#7D9A6D"
    }),

    new Konva.Ellipse({
      x: 0,
      y: -10,
      radiusX: 13,
      radiusY: 6,
      rotation: 90,
      fill: "#A1B58E"
    }),

    // цветя
    new Konva.Circle({
      x: -9,
      y: -3,
      radius: 8,
      fill: "#FFF8EA",
      stroke: "#D6B775",
      strokeWidth: 1
    }),

    new Konva.Circle({
      x: 9,
      y: -2,
      radius: 8,
      fill: "#FFFDF8",
      stroke: "#D6B775",
      strokeWidth: 1
    }),

    new Konva.Circle({
      x: 0,
      y: 4,
      radius: 9,
      fill: "#F4DFB7",
      stroke: "#C9A86A",
      strokeWidth: 1
    }),

    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 4,
      fill: "#B88D3E"
    })
  );

  return flowers;
}


function createTableCapacityLabel(text, x, y, width = 90) {
  const labelGroup = new Konva.Group({
    x,
    y,
    listening: false
  });

  labelGroup.add(
    new Konva.Rect({
      x: -width / 2,
      y: 0,
      width,
      height: 25,
      cornerRadius: 12,
      fill: "rgba(255,255,255,0.94)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      }
    }),

    new Konva.Text({
      x: -width / 2,
      y: 6,
      width,
      align: "center",
      text,
      fontFamily: "Inter",
      fontSize: 12,
      fontStyle: "bold",
      fill: "#102A43"
    })
  );

  return labelGroup;
}

// LUXURY ROUND TABLE

function createRoundTable(x = 180, y = 180) {
  const tableGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "roundTable",
    seats: 8
  });
  // Невидима интерактивна зона за избор и влачене
tableGroup.add(
  new Konva.Circle({
    x: 0,
    y: 0,
    radius: 108,
    fill: "rgba(255,255,255,0.001)",
    listening: true
  })
);

  const chairCount = 8;
  const chairDistance = 86;

  // столове
  for (let index = 0; index < chairCount; index++) {
    const angleDegrees = index * 45;
    const angleRadians = angleDegrees * Math.PI / 180;

    const chairX = Math.cos(angleRadians) * chairDistance;
    const chairY = Math.sin(angleRadians) * chairDistance;

    const chair = createLuxuryChair(
      chairX,
      chairY,
      angleDegrees + 90
    );

    tableGroup.add(chair);
  }

  // сянка под масата
  tableGroup.add(
    new Konva.Circle({
      x: 0,
      y: 9,
      radius: 65,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // основен плот
  tableGroup.add(
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 62,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 4,
      shadowColor: "rgba(16,42,67,0.18)",
      shadowBlur: 12,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    // покривка
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 55,
      fillRadialGradientStartPoint: {
        x: -18,
        y: -18
      },
      fillRadialGradientStartRadius: 3,
      fillRadialGradientEndPoint: {
        x: 0,
        y: 0
      },
      fillRadialGradientEndRadius: 58,
      fillRadialGradientColorStops: [
        0, "#FFFFFF",
        0.65, "#FFFDF8",
        1, "#F4E8D2"
      ],
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 2,
      listening: false
    }),

    // декоративна вътрешна линия
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 47,
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1,
      dash: [4, 4],
      listening: false
    })
  );

  // чинии
  for (let index = 0; index < chairCount; index++) {
    const angleRadians =
      (index * 45) * Math.PI / 180;

    const plateDistance = 40;

    const plateX =
      Math.cos(angleRadians) * plateDistance;

    const plateY =
      Math.sin(angleRadians) * plateDistance;

    tableGroup.add(
      new Konva.Circle({
        x: plateX,
        y: plateY,
        radius: 7,
        fill: "#FFFFFF",
        stroke: "#D2B272",
        strokeWidth: 1.3,
        listening: false
      }),

      new Konva.Circle({
        x: plateX,
        y: plateY,
        radius: 3,
        fill: "#F2E6CD",
        listening: false
      })
    );
  }

  // централен букет
  tableGroup.add(
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 23,
      fill: "rgba(201,168,106,0.12)",
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1,
      listening: false
    }),

    createFloralCenterpiece(0, 0, 0.85),

    createTableCapacityLabel(
      "8 места",
      0,
      102,
      82
    )
  );

  return tableGroup;
}

// LUXURY RECTANGULAR TABLE

function createRectTable(x = 260, y = 220) {
  const tableGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "rectTable",
    seats: 10
  });
  // Невидима интерактивна зона за избор и влачене
tableGroup.add(
  new Konva.Rect({
    x: -140,
    y: -95,
    width: 280,
    height: 190,
    cornerRadius: 20,
    fill: "rgba(255,255,255,0.001)",
    listening: true
  })
);

  const tableWidth = 180;
  const tableHeight = 76;

  // горни и долни столове – по 4
  for (let index = 0; index < 4; index++) {
    const chairX = -60 + index * 40;

    tableGroup.add(
      createLuxuryChair(
        chairX,
        -72,
        180
      ),

      createLuxuryChair(
        chairX,
        72,
        0
      )
    );
  }

  // крайни столове
  tableGroup.add(
    createLuxuryChair(
      -118,
      0,
      90
    ),

    createLuxuryChair(
      118,
      0,
      -90
    )
  );

  // сянка
  tableGroup.add(
    new Konva.Rect({
      x: -tableWidth / 2,
      y: -tableHeight / 2 + 8,
      width: tableWidth,
      height: tableHeight,
      cornerRadius: 20,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // основен плот
  tableGroup.add(
    new Konva.Rect({
      x: -tableWidth / 2,
      y: -tableHeight / 2,
      width: tableWidth,
      height: tableHeight,
      cornerRadius: 20,
      fillLinearGradientStartPoint: {
        x: -tableWidth / 2,
        y: -tableHeight / 2
      },
      fillLinearGradientEndPoint: {
        x: tableWidth / 2,
        y: tableHeight / 2
      },
      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.6, "#FFFDF8",
        1, "#F2E4CA"
      ],
      stroke: "#C9A86A",
      strokeWidth: 4,
      shadowColor: "rgba(16,42,67,0.18)",
      shadowBlur: 12,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    // вътрешна рамка
    new Konva.Rect({
      x: -76,
      y: -25,
      width: 152,
      height: 50,
      cornerRadius: 14,
      stroke: "rgba(201,168,106,0.50)",
      strokeWidth: 1.5,
      listening: false
    })
  );

  // чинии горе и долу
  for (let index = 0; index < 4; index++) {
    const plateX = -60 + index * 40;

    tableGroup.add(
      new Konva.Circle({
        x: plateX,
        y: -22,
        radius: 7,
        fill: "#FFFFFF",
        stroke: "#D2B272",
        strokeWidth: 1.2,
        listening: false
      }),

      new Konva.Circle({
        x: plateX,
        y: 22,
        radius: 7,
        fill: "#FFFFFF",
        stroke: "#D2B272",
        strokeWidth: 1.2,
        listening: false
      })
    );
  }

  // крайни чинии
  tableGroup.add(
    new Konva.Circle({
      x: -76,
      y: 0,
      radius: 7,
      fill: "#FFFFFF",
      stroke: "#D2B272",
      strokeWidth: 1.2,
      listening: false
    }),

    new Konva.Circle({
      x: 76,
      y: 0,
      radius: 7,
      fill: "#FFFFFF",
      stroke: "#D2B272",
      strokeWidth: 1.2,
      listening: false
    })
  );

  // цветни аранжировки
  tableGroup.add(
    createFloralCenterpiece(
      -35,
      0,
      0.62
    ),

    createFloralCenterpiece(
      35,
      0,
      0.62
    ),

    createTableCapacityLabel(
      "10 места",
      0,
      100,
      90
    )
  );

  return tableGroup;
}
function createAltar(x = 420, y = 120) {
  const altarGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "altar"
  });

  // Невидима интерактивна зона
  altarGroup.add(
    new Konva.Rect({
      x: -105,
      y: -70,
      width: 210,
      height: 220,
      cornerRadius: 28,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Мека сянка под арката
  altarGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 104,
      radiusX: 82,
      radiusY: 18,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Лява колона
  altarGroup.add(
    new Konva.Rect({
      x: -66,
      y: 10,
      width: 16,
      height: 92,
      cornerRadius: 8,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.14)",
      shadowBlur: 8,
      shadowOffset: {
        x: 0,
        y: 3
      },
      listening: false
    })
  );

  // Дясна колона
  altarGroup.add(
    new Konva.Rect({
      x: 50,
      y: 10,
      width: 16,
      height: 92,
      cornerRadius: 8,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.14)",
      shadowBlur: 8,
      shadowOffset: {
        x: 0,
        y: 3
      },
      listening: false
    })
  );

  // Основна арка
  altarGroup.add(
    new Konva.Arc({
      x: 0,
      y: 34,
      innerRadius: 50,
      outerRadius: 62,
      angle: 180,
      rotation: 180,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.14)",
      shadowBlur: 8,
      listening: false
    })
  );

  // Вътрешна декоративна арка
  altarGroup.add(
    new Konva.Arc({
      x: 0,
      y: 35,
      innerRadius: 43,
      outerRadius: 46,
      angle: 180,
      rotation: 180,
      fill: "#E8D6B7",
      opacity: 0.9,
      listening: false
    })
  );

  // Зеленина по арката
  const leafPositions = [
    { x: -47, y: 18, rotation: -40 },
    { x: -33, y: -2, rotation: -30 },
    { x: -16, y: -15, rotation: -10 },
    { x: 0, y: -20, rotation: 0 },
    { x: 16, y: -15, rotation: 10 },
    { x: 33, y: -2, rotation: 30 },
    { x: 47, y: 18, rotation: 40 }
  ];

  leafPositions.forEach((leaf, index) => {
    altarGroup.add(
      new Konva.Ellipse({
        x: leaf.x - 6,
        y: leaf.y,
        radiusX: 12,
        radiusY: 5,
        rotation: leaf.rotation - 20,
        fill: index % 2 === 0
          ? "#7D9A6D"
          : "#96AD84",
        listening: false
      }),

      new Konva.Ellipse({
        x: leaf.x + 6,
        y: leaf.y + 2,
        radiusX: 12,
        radiusY: 5,
        rotation: leaf.rotation + 20,
        fill: "#A3B990",
        listening: false
      })
    );
  });

  // Цветя по арката
  const flowerPositions = [
    { x: -42, y: 7, size: 8 },
    { x: -20, y: -10, size: 9 },
    { x: 0, y: -18, size: 10 },
    { x: 20, y: -10, size: 9 },
    { x: 42, y: 7, size: 8 }
  ];

  flowerPositions.forEach((flower, index) => {
    altarGroup.add(
      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: flower.size,
        fill: index % 2 === 0
          ? "#FFF8EA"
          : "#F3DDB6",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      }),

      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: 3,
        fill: "#B88D3E",
        listening: false
      })
    );
  });

  // Декорации в основата
  [-66, 66].forEach((baseX, index) => {
    altarGroup.add(
      new Konva.Ellipse({
        x: baseX - 10,
        y: 92,
        radiusX: 16,
        radiusY: 7,
        rotation: -25,
        fill: "#7D9A6D",
        listening: false
      }),

      new Konva.Ellipse({
        x: baseX + 10,
        y: 92,
        radiusX: 16,
        radiusY: 7,
        rotation: 25,
        fill: "#A1B58E",
        listening: false
      }),

      new Konva.Circle({
        x: baseX,
        y: 86,
        radius: 9,
        fill: index === 0
          ? "#FFF8EA"
          : "#F3DDB6",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      })
    );
  });

  // Надпис
  altarGroup.add(
    new Konva.Rect({
      x: -64,
      y: 118,
      width: 128,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -64,
      y: 125,
      width: 128,
      align: "center",
      text: "Сватбена арка",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return altarGroup;
}
function createDanceFloor(
  x = 520,
  y = 360,
  width = 180,
  height = 110
) {
  const danceGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "danceFloor"
  });

  // Невидима интерактивна зона
  danceGroup.add(
    new Konva.Rect({
      x: -width / 2 - 16,
      y: -height / 2 - 16,
      width: width + 32,
      height: height + 32,
      cornerRadius: 24,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Сянка под дансинга
  danceGroup.add(
    new Konva.Rect({
      x: -width / 2,
      y: -height / 2 + 10,
      width,
      height,
      cornerRadius: 18,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Основна рамка
  danceGroup.add(
    new Konva.Rect({
      x: -width / 2,
      y: -height / 2,
      width,
      height,
      cornerRadius: 18,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 4,
      shadowColor: "rgba(16,42,67,0.18)",
      shadowBlur: 14,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    })
  );

  // Вътрешна паркетна зона
  const innerPadding = 12;
  const innerX = -width / 2 + innerPadding;
  const innerY = -height / 2 + innerPadding;
  const innerWidth = width - innerPadding * 2;
  const innerHeight = height - innerPadding * 2;

  danceGroup.add(
    new Konva.Rect({
      x: innerX,
      y: innerY,
      width: innerWidth,
      height: innerHeight,
      cornerRadius: 12,
      fillLinearGradientStartPoint: {
        x: innerX,
        y: innerY
      },
      fillLinearGradientEndPoint: {
        x: innerX + innerWidth,
        y: innerY + innerHeight
      },
      fillLinearGradientColorStops: [
        0, "#F6E9D4",
        0.5, "#E9D0AA",
        1, "#DDBB89"
      ],
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1.5,
      listening: false
    })
  );

  // Паркетни ламели
  const plankHeight = 20;

  for (
    let plankY = innerY;
    plankY < innerY + innerHeight;
    plankY += plankHeight
  ) {
    const rowIndex = Math.floor(
      (plankY - innerY) / plankHeight
    );

    const offset = rowIndex % 2 === 0 ? 0 : 28;

    for (
      let plankX = innerX - offset;
      plankX < innerX + innerWidth;
      plankX += 56
    ) {
      const visibleX = Math.max(plankX, innerX);
      const visibleRight = Math.min(
        plankX + 56,
        innerX + innerWidth
      );

      const visibleWidth = visibleRight - visibleX;

      if (visibleWidth <= 0) continue;

      danceGroup.add(
        new Konva.Rect({
          x: visibleX,
          y: plankY,
          width: visibleWidth,
          height: Math.min(
            plankHeight,
            innerY + innerHeight - plankY
          ),
          stroke: "rgba(139,94,50,0.28)",
          strokeWidth: 1,
          listening: false
        })
      );
    }
  }

  // Декоративна вътрешна рамка
  danceGroup.add(
    new Konva.Rect({
      x: innerX + 6,
      y: innerY + 6,
      width: innerWidth - 12,
      height: innerHeight - 12,
      cornerRadius: 9,
      stroke: "rgba(255,255,255,0.75)",
      strokeWidth: 2,
      listening: false
    })
  );

  // Малки светлинни точки в ъглите
  const lightPoints = [
    {
      x: innerX + 10,
      y: innerY + 10
    },
    {
      x: innerX + innerWidth - 10,
      y: innerY + 10
    },
    {
      x: innerX + 10,
      y: innerY + innerHeight - 10
    },
    {
      x: innerX + innerWidth - 10,
      y: innerY + innerHeight - 10
    }
  ];

  lightPoints.forEach(point => {
    danceGroup.add(
      new Konva.Circle({
        x: point.x,
        y: point.y,
        radius: 4,
        fill: "#F4D58A",
        shadowColor: "#F4D58A",
        shadowBlur: 8,
        listening: false
      })
    );
  });

  // Централен декоративен знак
  danceGroup.add(
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: Math.min(width, height) * 0.18,
      fill: "rgba(255,255,255,0.42)",
      stroke: "rgba(201,168,106,0.75)",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Text({
      x: -32,
      y: -16,
      width: 64,
      align: "center",
      text: "♪",
      fontFamily: "Inter",
      fontSize: 30,
      fontStyle: "bold",
      fill: "#A97E3D",
      listening: false
    })
  );

  // Надпис
  danceGroup.add(
    new Konva.Rect({
      x: -52,
      y: height / 2 + 16,
      width: 104,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -52,
      y: height / 2 + 23,
      width: 104,
      align: "center",
      text: "Дансинг",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return danceGroup;
}
function createAisle(x = 760, y = 260) {
  const aisleGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "aisle"
  });

  // Невидима интерактивна зона
  aisleGroup.add(
    new Konva.Rect({
      x: -70,
      y: -165,
      width: 140,
      height: 360,
      cornerRadius: 28,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Сянка
  aisleGroup.add(
    new Konva.Rect({
      x: -43,
      y: -142,
      width: 86,
      height: 300,
      cornerRadius: 26,
      fill: "rgba(16,42,67,0.10)",
      listening: false
    })
  );

  // Основен килим
  aisleGroup.add(
    new Konva.Rect({
      x: -40,
      y: -150,
      width: 80,
      height: 300,
      cornerRadius: 24,
      fillLinearGradientStartPoint: {
        x: -40,
        y: -150
      },
      fillLinearGradientEndPoint: {
        x: 40,
        y: 150
      },
      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.5, "#FFFDF8",
        1, "#F2E4CA"
      ],
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.14)",
      shadowBlur: 10,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    })
  );

  // Вътрешен декоративен контур
  aisleGroup.add(
    new Konva.Rect({
      x: -31,
      y: -140,
      width: 62,
      height: 280,
      cornerRadius: 19,
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1.5,
      dash: [8, 6],
      listening: false
    })
  );

  // Централна линия
  aisleGroup.add(
    new Konva.Line({
      points: [
        0, -125,
        0, 125
      ],
      stroke: "rgba(201,168,106,0.28)",
      strokeWidth: 2,
      dash: [7, 8],
      listening: false
    })
  );

  // Декоративни композиции по двете страни
  const decorationY = [
    -110,
    -60,
    -10,
    40,
    90
  ];

  decorationY.forEach((currentY, index) => {
    [-58, 58].forEach((sideX, sideIndex) => {
      const direction = sideX < 0 ? -1 : 1;

      aisleGroup.add(
        // зеленина
        new Konva.Ellipse({
          x: sideX - 7 * direction,
          y: currentY + 3,
          radiusX: 15,
          radiusY: 6,
          rotation: sideX < 0 ? -28 : 28,
          fill: index % 2 === 0
            ? "#7D9A6D"
            : "#95AA83",
          listening: false
        }),

        new Konva.Ellipse({
          x: sideX + 7 * direction,
          y: currentY + 4,
          radiusX: 14,
          radiusY: 6,
          rotation: sideX < 0 ? 28 : -28,
          fill: "#A2B690",
          listening: false
        }),

        // цвете
        new Konva.Circle({
          x: sideX,
          y: currentY,
          radius: 8,
          fill: sideIndex === 0
            ? "#FFF8EA"
            : "#F3DDB6",
          stroke: "#C9A86A",
          strokeWidth: 1,
          listening: false
        }),

        new Konva.Circle({
          x: sideX,
          y: currentY,
          radius: 3,
          fill: "#B88D3E",
          listening: false
        }),

        // свещ
        new Konva.Rect({
          x: sideX - 3,
          y: currentY + 13,
          width: 6,
          height: 18,
          cornerRadius: 3,
          fill: "#FFFDF8",
          stroke: "rgba(201,168,106,0.65)",
          strokeWidth: 1,
          listening: false
        }),

        // пламък
        new Konva.Ellipse({
          x: sideX,
          y: currentY + 10,
          radiusX: 3,
          radiusY: 5,
          fill: "#F2C56C",
          listening: false
        })
      );
    });
  });

  // Надпис
  aisleGroup.add(
    new Konva.Rect({
      x: -53,
      y: 168,
      width: 106,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -53,
      y: 175,
      width: 106,
      align: "center",
      text: "Пътека",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return aisleGroup;
}
function createHeadTable(x = 560, y = 120) {
  const headTableGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "headTable"
  });

  // Невидима интерактивна зона
  headTableGroup.add(
    new Konva.Rect({
      x: -165,
      y: -85,
      width: 330,
      height: 190,
      cornerRadius: 28,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Мека сянка под президиума
  headTableGroup.add(
    new Konva.Rect({
      x: -136,
      y: -26,
      width: 272,
      height: 76,
      cornerRadius: 24,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Основна маса
  headTableGroup.add(
    new Konva.Rect({
      x: -140,
      y: -42,
      width: 280,
      height: 72,
      cornerRadius: 24,

      fillLinearGradientStartPoint: {
        x: -140,
        y: -42
      },

      fillLinearGradientEndPoint: {
        x: 140,
        y: 30
      },

      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.55, "#FFFDF8",
        1, "#F2E4CA"
      ],

      stroke: "#C9A86A",
      strokeWidth: 4,

      shadowColor: "rgba(16,42,67,0.18)",
      shadowBlur: 14,

      shadowOffset: {
        x: 0,
        y: 4
      },

      listening: false
    })
  );

  // Вътрешна декоративна рамка
  headTableGroup.add(
    new Konva.Rect({
      x: -118,
      y: -27,
      width: 236,
      height: 42,
      cornerRadius: 17,
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1.5,
      listening: false
    })
  );

  // Драпировка отпред
  headTableGroup.add(
    new Konva.Line({
      points: [
        -125, 18,
        -95, 35,
        -60, 20,
        -25, 38,
        10, 20,
        45, 38,
        80, 20,
        115, 34,
        130, 18
      ],
      stroke: "#E8D6B7",
      strokeWidth: 9,
      tension: 0.35,
      lineCap: "round",
      lineJoin: "round",
      listening: false
    })
  );

  // Цветна аранжировка отпред
  const flowerPositions = [
    -105,
    -70,
    -35,
    0,
    35,
    70,
    105
  ];

  flowerPositions.forEach((flowerX, index) => {
    headTableGroup.add(
      new Konva.Ellipse({
        x: flowerX - 8,
        y: 28,
        radiusX: 13,
        radiusY: 5,
        rotation: -28,
        fill: index % 2 === 0
          ? "#7D9A6D"
          : "#A1B58E",
        listening: false
      }),

      new Konva.Ellipse({
        x: flowerX + 8,
        y: 29,
        radiusX: 13,
        radiusY: 5,
        rotation: 28,
        fill: "#8EAA7D",
        listening: false
      }),

      new Konva.Circle({
        x: flowerX,
        y: 24,
        radius: 8,
        fill: index % 2 === 0
          ? "#FFF8EA"
          : "#F3DDB6",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      }),

      new Konva.Circle({
        x: flowerX,
        y: 24,
        radius: 3,
        fill: "#B88D3E",
        listening: false
      })
    );
  });

  // Два луксозни стола зад масата
  headTableGroup.add(
    createLuxuryChair(
      -42,
      -76,
      180
    ),

    createLuxuryChair(
      42,
      -76,
      180
    )
  );

  // Малки централни декорации
  headTableGroup.add(
    createFloralCenterpiece(
      -45,
      -4,
      0.55
    ),

    createFloralCenterpiece(
      45,
      -4,
      0.55
    )
  );

  // Надпис
  headTableGroup.add(
    new Konva.Rect({
      x: -63,
      y: 62,
      width: 126,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 6,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -63,
      y: 69,
      width: 126,
      align: "center",
      text: "Президиум",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return headTableGroup;
}
function createPhotoZone(x = 900, y = 140) {
  const photoGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "photoZone"
  });

  // Невидима интерактивна зона
  photoGroup.add(
    new Konva.Rect({
      x: -120,
      y: -95,
      width: 240,
      height: 220,
      cornerRadius: 30,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Сянка
  photoGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 76,
      radiusX: 92,
      radiusY: 18,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Голям декоративен кръг
  photoGroup.add(
    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 72,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 5,
      shadowColor: "rgba(16,42,67,0.16)",
      shadowBlur: 12,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    new Konva.Circle({
      x: 0,
      y: 0,
      radius: 61,
      fillLinearGradientStartPoint: {
        x: -50,
        y: -50
      },
      fillLinearGradientEndPoint: {
        x: 50,
        y: 50
      },
      fillLinearGradientColorStops: [
        0, "#F6FBFF",
        0.5, "#FFFDF8",
        1, "#F2E4CA"
      ],
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1.5,
      listening: false
    })
  );

  // Декоративен диван
  photoGroup.add(
    new Konva.Rect({
      x: -48,
      y: 22,
      width: 96,
      height: 34,
      cornerRadius: 16,
      fill: "#F6E9D4",
      stroke: "#C9A86A",
      strokeWidth: 2,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 6,
      shadowOffset: {
        x: 0,
        y: 3
      },
      listening: false
    }),

    new Konva.Rect({
      x: -42,
      y: 8,
      width: 84,
      height: 28,
      cornerRadius: 15,
      fill: "#FFFDF8",
      stroke: "#D4B474",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: -38,
      y: 28,
      radius: 12,
      fill: "#F2E4CA",
      stroke: "#C9A86A",
      strokeWidth: 1.5,
      listening: false
    }),

    new Konva.Circle({
      x: 38,
      y: 28,
      radius: 12,
      fill: "#F2E4CA",
      stroke: "#C9A86A",
      strokeWidth: 1.5,
      listening: false
    }),

    new Konva.Rect({
      x: -33,
      y: 55,
      width: 10,
      height: 12,
      cornerRadius: 4,
      fill: "#B98D4A",
      listening: false
    }),

    new Konva.Rect({
      x: 23,
      y: 55,
      width: 10,
      height: 12,
      cornerRadius: 4,
      fill: "#B98D4A",
      listening: false
    })
  );

  // Цветна украса отляво и отдясно
  const floralClusters = [
    {
      x: -62,
      y: -42,
      rotation: -25
    },
    {
      x: 62,
      y: -42,
      rotation: 25
    }
  ];

  floralClusters.forEach((cluster, clusterIndex) => {
    photoGroup.add(
      new Konva.Ellipse({
        x: cluster.x - 12,
        y: cluster.y + 4,
        radiusX: 18,
        radiusY: 7,
        rotation: cluster.rotation - 15,
        fill: "#7D9A6D",
        listening: false
      }),

      new Konva.Ellipse({
        x: cluster.x + 12,
        y: cluster.y + 5,
        radiusX: 18,
        radiusY: 7,
        rotation: cluster.rotation + 15,
        fill: "#A1B58E",
        listening: false
      }),

      new Konva.Circle({
        x: cluster.x,
        y: cluster.y,
        radius: 11,
        fill: clusterIndex === 0
          ? "#FFF8EA"
          : "#F3DDB6",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      }),

      new Konva.Circle({
        x: cluster.x,
        y: cluster.y,
        radius: 4,
        fill: "#B88D3E",
        listening: false
      })
    );
  });

  // Допълнителни малки цветя
  const smallFlowers = [
    { x: -50, y: -60 },
    { x: -28, y: -70 },
    { x: 28, y: -70 },
    { x: 50, y: -60 }
  ];

  smallFlowers.forEach((flower, index) => {
    photoGroup.add(
      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: 7,
        fill: index % 2 === 0
          ? "#FFFDF8"
          : "#F3DDB6",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      })
    );
  });

  // Камера
  photoGroup.add(
    new Konva.Rect({
      x: -15,
      y: -22,
      width: 30,
      height: 22,
      cornerRadius: 6,
      fill: "#1E4E8C",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Rect({
      x: -8,
      y: -29,
      width: 16,
      height: 8,
      cornerRadius: 4,
      fill: "#1E4E8C",
      stroke: "#C9A86A",
      strokeWidth: 1,
      listening: false
    }),

    new Konva.Circle({
      x: 0,
      y: -11,
      radius: 7,
      fill: "#FFFFFF",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: 0,
      y: -11,
      radius: 3,
      fill: "#102A43",
      listening: false
    })
  );

  // Надпис
  photoGroup.add(
    new Konva.Rect({
      x: -54,
      y: 90,
      width: 108,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -54,
      y: 97,
      width: 108,
      align: "center",
      text: "Фотозона",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return photoGroup;
}
function createCakeZone(x = 980, y = 340) {
  const cakeGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "cakeZone"
  });

  // Невидима интерактивна зона
  cakeGroup.add(
    new Konva.Rect({
      x: -95,
      y: -100,
      width: 190,
      height: 220,
      cornerRadius: 28,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Сянка под масичката
  cakeGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 70,
      radiusX: 56,
      radiusY: 16,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Основа на масичката
  cakeGroup.add(
    new Konva.Circle({
      x: 0,
      y: 38,
      radius: 48,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 4,
      shadowColor: "rgba(16,42,67,0.16)",
      shadowBlur: 10,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    new Konva.Circle({
      x: 0,
      y: 38,
      radius: 39,
      fill: "#F6E9D4",
      stroke: "rgba(201,168,106,0.45)",
      strokeWidth: 1.5,
      listening: false
    }),

    new Konva.Rect({
      x: -7,
      y: 70,
      width: 14,
      height: 30,
      cornerRadius: 7,
      fill: "#C9A86A",
      listening: false
    }),

    new Konva.Ellipse({
      x: 0,
      y: 101,
      radiusX: 28,
      radiusY: 8,
      fill: "#B98D4A",
      listening: false
    })
  );

  // Долно ниво на тортата
  cakeGroup.add(
    new Konva.Rect({
      x: -34,
      y: 12,
      width: 68,
      height: 32,
      cornerRadius: 10,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 2,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      listening: false
    })
  );

  // Средно ниво
  cakeGroup.add(
    new Konva.Rect({
      x: -25,
      y: -18,
      width: 50,
      height: 30,
      cornerRadius: 9,
      fill: "#FFFFFF",
      stroke: "#D9BC82",
      strokeWidth: 2,
      listening: false
    })
  );

  // Горно ниво
  cakeGroup.add(
    new Konva.Rect({
      x: -16,
      y: -44,
      width: 32,
      height: 26,
      cornerRadius: 8,
      fill: "#FFFDF8",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    })
  );

  // Декоративни ленти
  cakeGroup.add(
    new Konva.Line({
      points: [-32, 33, 32, 33],
      stroke: "#E0C08A",
      strokeWidth: 3,
      listening: false
    }),

    new Konva.Line({
      points: [-23, 2, 23, 2],
      stroke: "#E0C08A",
      strokeWidth: 3,
      listening: false
    }),

    new Konva.Line({
      points: [-14, -27, 14, -27],
      stroke: "#E0C08A",
      strokeWidth: 3,
      listening: false
    })
  );

  // Цветя по тортата
  const cakeFlowers = [
    { x: -28, y: 20, size: 7 },
    { x: 22, y: -5, size: 6 },
    { x: -10, y: -35, size: 5 }
  ];

  cakeFlowers.forEach((flower, index) => {
    cakeGroup.add(
      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: flower.size,
        fill: index % 2 === 0
          ? "#F3DDB6"
          : "#FFF8EA",
        stroke: "#C9A86A",
        strokeWidth: 1,
        listening: false
      }),

      new Konva.Circle({
        x: flower.x,
        y: flower.y,
        radius: 2.5,
        fill: "#B88D3E",
        listening: false
      }),

      new Konva.Ellipse({
        x: flower.x - 8,
        y: flower.y + 3,
        radiusX: 8,
        radiusY: 3,
        rotation: -25,
        fill: "#7D9A6D",
        listening: false
      })
    );
  });

  // Топер
  cakeGroup.add(
    new Konva.Text({
      x: -17,
      y: -67,
      width: 34,
      align: "center",
      text: "♥",
      fontFamily: "Inter",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#C9A86A",
      listening: false
    })
  );

  // Надпис
  cakeGroup.add(
    new Konva.Rect({
      x: -62,
      y: 116,
      width: 124,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -62,
      y: 123,
      width: 124,
      align: "center",
      text: "Зона за торта",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return cakeGroup;
}
function createDJBooth(x = 1180, y = 180) {
  const djGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "djBooth"
  });

  // Невидима интерактивна зона
  djGroup.add(
    new Konva.Rect({
      x: -125,
      y: -100,
      width: 250,
      height: 220,
      cornerRadius: 28,
      fill: "rgba(255,255,255,0.001)",
      listening: true
    })
  );

  // Сянка
  djGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 72,
      radiusX: 96,
      radiusY: 18,
      fill: "rgba(16,42,67,0.12)",
      listening: false
    })
  );

  // Лява тонколона
  djGroup.add(
    new Konva.Rect({
      x: -105,
      y: -52,
      width: 40,
      height: 100,
      cornerRadius: 12,
      fill: "#102A43",
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.2)",
      shadowBlur: 10,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    new Konva.Circle({
      x: -85,
      y: -22,
      radius: 11,
      fill: "#EAF4FF",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: -85,
      y: 20,
      radius: 15,
      fill: "#F8F3EA",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: -85,
      y: 20,
      radius: 6,
      fill: "#1E4E8C",
      listening: false
    })
  );

  // Дясна тонколона
  djGroup.add(
    new Konva.Rect({
      x: 65,
      y: -52,
      width: 40,
      height: 100,
      cornerRadius: 12,
      fill: "#102A43",
      stroke: "#C9A86A",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.2)",
      shadowBlur: 10,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    new Konva.Circle({
      x: 85,
      y: -22,
      radius: 11,
      fill: "#EAF4FF",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: 85,
      y: 20,
      radius: 15,
      fill: "#F8F3EA",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: 85,
      y: 20,
      radius: 6,
      fill: "#1E4E8C",
      listening: false
    })
  );

  // Основен DJ пулт
  djGroup.add(
    new Konva.Rect({
      x: -65,
      y: -35,
      width: 130,
      height: 72,
      cornerRadius: 18,
      fillLinearGradientStartPoint: {
        x: -65,
        y: -35
      },
      fillLinearGradientEndPoint: {
        x: 65,
        y: 37
      },
      fillLinearGradientColorStops: [
        0, "#FFFFFF",
        0.55, "#F6FBFF",
        1, "#DCEBFA"
      ],
      stroke: "#1E4E8C",
      strokeWidth: 3,
      shadowColor: "rgba(16,42,67,0.18)",
      shadowBlur: 12,
      shadowOffset: {
        x: 0,
        y: 4
      },
      listening: false
    }),

    new Konva.Rect({
      x: -52,
      y: -22,
      width: 104,
      height: 42,
      cornerRadius: 12,
      fill: "#102A43",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    })
  );

  // Грамофони
  djGroup.add(
    new Konva.Circle({
      x: -27,
      y: -1,
      radius: 15,
      fill: "#F8F3EA",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: -27,
      y: -1,
      radius: 6,
      fill: "#1E4E8C",
      listening: false
    }),

    new Konva.Circle({
      x: 27,
      y: -1,
      radius: 15,
      fill: "#F8F3EA",
      stroke: "#C9A86A",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Circle({
      x: 27,
      y: -1,
      radius: 6,
      fill: "#1E4E8C",
      listening: false
    })
  );

  // Централен миксер
  djGroup.add(
    new Konva.Rect({
      x: -9,
      y: -12,
      width: 18,
      height: 25,
      cornerRadius: 5,
      fill: "#EAF4FF",
      stroke: "#C9A86A",
      strokeWidth: 1.5,
      listening: false
    })
  );

  // Малки контролни лампички
  const controlLights = [
    { x: -4, y: -7, fill: "#F4D58A" },
    { x: 4, y: -7, fill: "#EAF4FF" },
    { x: -4, y: 1, fill: "#C9A86A" },
    { x: 4, y: 1, fill: "#7D9A6D" }
  ];

  controlLights.forEach(light => {
    djGroup.add(
      new Konva.Circle({
        x: light.x,
        y: light.y,
        radius: 2.5,
        fill: light.fill,
        listening: false
      })
    );
  });

  // Лаптоп
  djGroup.add(
    new Konva.Rect({
      x: -24,
      y: -62,
      width: 48,
      height: 30,
      cornerRadius: 5,
      fill: "#F6FBFF",
      stroke: "#1E4E8C",
      strokeWidth: 2,
      listening: false
    }),

    new Konva.Rect({
      x: -21,
      y: -58,
      width: 42,
      height: 22,
      cornerRadius: 3,
      fill: "#102A43",
      listening: false
    }),

    new Konva.Line({
      points: [-28, -30, 28, -30],
      stroke: "#C9A86A",
      strokeWidth: 3,
      lineCap: "round",
      listening: false
    })
  );

  // Осветление
  const lightPositions = [
    { x: -50, y: -76, color: "#F4D58A" },
    { x: 0, y: -86, color: "#EAF4FF" },
    { x: 50, y: -76, color: "#C9A86A" }
  ];

  lightPositions.forEach(light => {
    djGroup.add(
      new Konva.Circle({
        x: light.x,
        y: light.y,
        radius: 6,
        fill: light.color,
        shadowColor: light.color,
        shadowBlur: 14,
        listening: false
      })
    );
  });

  // Надпис
  djGroup.add(
    new Konva.Rect({
      x: -48,
      y: 86,
      width: 96,
      height: 28,
      cornerRadius: 14,
      fill: "rgba(255,255,255,0.95)",
      stroke: "rgba(201,168,106,0.55)",
      strokeWidth: 1,
      shadowColor: "rgba(16,42,67,0.12)",
      shadowBlur: 5,
      shadowOffset: {
        x: 0,
        y: 2
      },
      listening: false
    }),

    new Konva.Text({
      x: -48,
      y: 93,
      width: 96,
      align: "center",
      text: "DJ зона",
      fontFamily: "Inter",
      fontSize: 13,
      fontStyle: "bold",
      fill: "#102A43",
      listening: false
    })
  );

  return djGroup;
}
function createBarZone(x = 1200, y = 430) {

  const barGroup = new Konva.Group({
    x,
    y,
    draggable: true,
    name: "barZone"
  });

  // интерактивна зона
  barGroup.add(
    new Konva.Rect({
      x: -135,
      y: -105,
      width: 270,
      height: 220,
      cornerRadius: 25,
      fill: "rgba(255,255,255,0.001)"
    })
  );

  // сянка
  barGroup.add(
    new Konva.Ellipse({
      x: 0,
      y: 74,
      radiusX: 95,
      radiusY: 18,
      fill: "rgba(0,0,0,0.12)",
      listening:false
    })
  );

  // бар плот
  barGroup.add(
    new Konva.Rect({
      x:-90,
      y:-18,
      width:180,
      height:52,
      cornerRadius:18,
      fillLinearGradientStartPoint:{x:-90,y:0},
      fillLinearGradientEndPoint:{x:90,y:0},
      fillLinearGradientColorStops:[
        0,"#FFFFFF",
        .5,"#F8F1E5",
        1,"#E7D0A4"
      ],
      stroke:"#C8A25C",
      strokeWidth:3,
      shadowColor:"rgba(0,0,0,.15)",
      shadowBlur:10,
      shadowOffset:{x:0,y:4},
      listening:false
    })
  );

  // вътрешен плот
  barGroup.add(
    new Konva.Rect({
      x:-72,
      y:-8,
      width:144,
      height:18,
      cornerRadius:8,
      fill:"#FDFDFD",
      stroke:"#C8A25C",
      strokeWidth:1,
      listening:false
    })
  );

  // бутилки
  const bottles=[-55,-25,5,35,60];

  bottles.forEach((xPos,i)=>{

      barGroup.add(

        new Konva.Rect({
            x:xPos,
            y:-58,
            width:10,
            height:30,
            cornerRadius:3,
            fill:[
              "#6D8F6B",
              "#4973A3",
              "#A36549",
              "#C39D52",
              "#739C93"
            ][i],
            stroke:"#C8A25C",
            strokeWidth:1,
            listening:false
        }),

        new Konva.Circle({
            x:xPos+5,
            y:-62,
            radius:3,
            fill:"#EFD9A4",
            listening:false
        })

      );

  });

  // чаши
  [-45,-15,15,45].forEach(xPos=>{

      barGroup.add(

      new Konva.Line({
        points:[
          xPos,-10,
          xPos-5,18,
          xPos+5,18,
          xPos,-10
        ],
        closed:true,
        fill:"#F6FBFF",
        stroke:"#C8A25C",
        strokeWidth:1,
        listening:false
      })

      );

  });

  // бар столове
  [-55,0,55].forEach(xPos=>{

      barGroup.add(

      new Konva.Circle({
          x:xPos,
          y:60,
          radius:11,
          fill:"#F7F1E6",
          stroke:"#C8A25C",
          strokeWidth:2,
          listening:false
      }),

      new Konva.Rect({
          x:xPos-2,
          y:38,
          width:4,
          height:18,
          fill:"#B88D3E",
          listening:false
      }),

      new Konva.Line({
          points:[
            xPos-11,70,
            xPos+11,70
          ],
          stroke:"#B88D3E",
          strokeWidth:3,
          listening:false
      })

      );

  });

  // декоративни листа
  [-88,88].forEach(side=>{

      barGroup.add(

      new Konva.Ellipse({
          x:side,
          y:-34,
          radiusX:18,
          radiusY:7,
          rotation:side<0?-25:25,
          fill:"#7D9A6D",
          listening:false
      }),

      new Konva.Circle({
          x:side,
          y:-42,
          radius:8,
          fill:"#FFF8EA",
          stroke:"#C8A25C",
          strokeWidth:1,
          listening:false
      })

      );

  });

  // надпис
  barGroup.add(

      new Konva.Rect({
          x:-48,
          y:90,
          width:96,
          height:28,
          cornerRadius:14,
          fill:"rgba(255,255,255,.95)",
          stroke:"#C8A25C",
          strokeWidth:1,
          listening:false
      }),

      new Konva.Text({
          x:-48,
          y:97,
          width:96,
          align:"center",
          text:"Бар зона",
          fontFamily:"Inter",
          fontStyle:"bold",
          fontSize:13,
          fill:"#102A43",
          listening:false
      })

  );

  return barGroup;
}
// Правим функциите достъпни за planner.js
window.plannerTheme = plannerTheme;
window.createElementLabel = createElementLabel;
window.drawVenueBackground = drawVenueBackground;
window.createRoundTable = createRoundTable;
window.createRectTable = createRectTable;
window.createAltar = createAltar;
window.createDanceFloor = createDanceFloor;
window.createAisle = createAisle;
window.createHeadTable = createHeadTable;
window.createPhotoZone = createPhotoZone;
window.createCakeZone = createCakeZone; 
window.createDJBooth = createDJBooth;
window.createBarZone = createBarZone;