
// HALL LAYOUT PLANNER - MAIN CONTROLLER

const plannerCanvas = document.getElementById("plannerCanvas");

if (plannerCanvas) {
  const STAGE_WIDTH = 1850;
  const STAGE_HEIGHT = 1150;

  const stage = new Konva.Stage({
    container: "plannerCanvas",
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  let selectedElement = null;

  const TABLE_GEOMETRY = {
    roundTable: { baseWidth: 190, baseHeight: 190, seats: 8 },
    rectTable: { baseWidth: 255, baseHeight: 185, seats: 10 }
  };

  // Единен размер за ръчно и AI добавени елементи.
  const ELEMENT_SCALE = 0.90;

  // Единен размер на дансинга за ръчно и AI добавяне.
  const DANCE_FLOOR_SIZE = {
    width: 280,
    height: 190
  };

  function drawPlannerBackground() {
    if (typeof window.drawVenueBackground === "function") {
      window.drawVenueBackground(stage, layer);
    }
  }

  function selectElement(group) {
    if (!group || group.isDestroyed()) {
      return;
    }

    if (
      selectedElement &&
      !selectedElement.isDestroyed() &&
      selectedElement !== group
    ) {
      selectedElement.opacity(1);
    }

    selectedElement = group;
    selectedElement.opacity(0.85);

    layer.batchDraw();
  }

  function applySelectable(group) {
    if (!group) {
      return group;
    }

    group.off(".plannerSelection");

    group.on(
      "click.plannerSelection tap.plannerSelection dragstart.plannerSelection",
      function () {
        selectElement(group);
      }
    );

    return group;
  }

  function addPlannerElement(
    type,
    x,
    y,
    rotation = 0,
    width = 180,
    height = 110,
    scale = 1
  ) {
    const factories = {
      roundTable: window.createRoundTable,
      rectTable: window.createRectTable,
      altar: window.createAltar,
      danceFloor: window.createDanceFloor,
      aisle: window.createAisle,
      headTable: window.createHeadTable,
      photoZone: window.createPhotoZone,
      cakeZone: window.createCakeZone,
      djBooth: window.createDJBooth,
      barZone: window.createBarZone
    };

    const factory = factories[type];

    if (typeof factory !== "function") {
      console.warn("Липсва фабрика за елемент:", type);
      return null;
    }

    const element =
      type === "danceFloor"
        ? factory(x, y, width, height)
        : factory(x, y);

    if (!element) return null;

    element.rotation(rotation);
    element.scale({ x: scale, y: scale });

    applySelectable(element);
    layer.add(element);

    return element;
  }

  function clearPlanner() {
    layer.destroyChildren();
    selectedElement = null;

    drawPlannerBackground();
    layer.draw();
  }

  function applyElementMetadata(element, item) {
    if (!element || !item) return;

    if (
      item.type === "roundTable" ||
      item.type === "rectTable"
    ) {
      const tableNumber = Number(item.tableNumber) || 0;

      const badge = new Konva.Circle({
        x: 0,
        y: -5,
        radius: 16,
        fill: "#1E4E8C",
        stroke: "#C9A86A",
        strokeWidth: 2,
        listening: false
      });

      const numberText = new Konva.Text({
        x: -14,
        y: -13,
        width: 28,
        align: "center",
        text: String(tableNumber),
        fontSize: 14,
        fontStyle: "bold",
        fill: "#FFFFFF",
        listening: false
      });

      element.add(badge, numberText);
    }
  }

  function updatePlannerSummary(layoutData) {
    if (!layoutData || !layoutData.statistics) return;

    const totalSeatsEl = document.getElementById("summaryTotalSeats");
    const roundTablesEl = document.getElementById("summaryRoundTables");
    const rectTablesEl = document.getElementById("summaryRectTables");
    const styleEl = document.getElementById("summaryStyle");
    const spaceStatusEl = document.getElementById("summarySpaceStatus");

    if (totalSeatsEl) {
      totalSeatsEl.textContent =
        `Общо места: ${layoutData.statistics.totalSeats}`;
    }

    if (roundTablesEl) {
      roundTablesEl.textContent =
        `Кръгли маси: ${layoutData.statistics.roundTables}`;
    }

    if (rectTablesEl) {
      rectTablesEl.textContent =
        `Правоъгълни маси: ${layoutData.statistics.rectTables}`;
    }

    if (styleEl && layoutData.layoutInfo) {
      styleEl.textContent =
        `Стил: ${layoutData.layoutInfo.style}`;
    }

    if (spaceStatusEl) {
      spaceStatusEl.textContent =
        layoutData.warnings &&
        layoutData.warnings.length > 0
          ? "Свободно пространство: Ограничено"
          : "Свободно пространство: Добро";
    }
  }

  function generateLayoutFromJSON(layoutData) {
    if (!layoutData || !Array.isArray(layoutData.elements)) {
      alert("Невалиден layout формат.");
      return;
    }

    clearPlanner();

    layoutData.elements.forEach(item => {
      const element = addPlannerElement(
        item.type,
        item.x,
        item.y,
        item.rotation || 0,
        item.width || 180,
        item.height || 110,
        item.scale || 1
      );

      applyElementMetadata(element, item);
    });

    layer.draw();

    updatePlannerSummary(layoutData);

    localStorage.setItem(
      "weddingLayout",
      stage.toJSON()
    );
  }

  // REQUIREMENTS PARSER
  
  function extractLayoutRequirements(description) {
    const text = String(description || "").toLowerCase();

    // БРОЙ ГОСТИ
    
    const guestMatch = text.match(
      /(\d+)\s*(?:гости|госта|гост|guests?|people)/
    );

    const guestCount = guestMatch
      ? Math.max(10, parseInt(guestMatch[1], 10))
      : 100;

    // -------------------------------------
    // СТИЛ
    // -------------------------------------

    let style = "Elegant";

    if (
      text.includes("лукс") ||
      text.includes("luxury")
    ) {
      style = "Luxury";

    } else if (
      text.includes("бохо") ||
      text.includes("boho")
    ) {
      style = "Boho";

    } else if (
      text.includes("рустик") ||
      text.includes("rustic")
    ) {
      style = "Rustic";

    } else if (
      text.includes("модерн") ||
      text.includes("modern")
    ) {
      style = "Modern";

    } else if (
      text.includes("клас") ||
      text.includes("classic")
    ) {
      style = "Classic";
    }

    // ТОЧЕН БРОЙ МАСИ

    const roundMatch = text.match(
      /(\d+)\s*(?:бр\.?\s*)?(?:кръгли|кръгла|кръгли маси|round tables?)/
    );

    const rectMatch = text.match(
      /(\d+)\s*(?:бр\.?\s*)?(?:правоъгълни|правоъгълна|правоъгълни маси|rectangular tables?|rect tables?)/
    );

    const roundTableCount = roundMatch
      ? parseInt(roundMatch[1], 10)
      : 0;

    const rectTableCount = rectMatch
      ? parseInt(rectMatch[1], 10)
      : 0;

    // ТИП МАСИ
  
    const hasRoundTables =
      roundTableCount > 0 ||
      text.includes("кръгл") ||
      text.includes("round table");

    const hasRectTables =
      rectTableCount > 0 ||
      text.includes("правоъгъл") ||
      text.includes("rectangular") ||
      text.includes("rect table");

    let tableType = "roundTable";

    if (hasRoundTables && hasRectTables) {
      tableType = "mixed";

    } else if (hasRectTables) {
      tableType = "rectTable";
    }

    // РАЗСТОЯНИЕ
    
    let spacingMode = "balanced";

    if (
      text.includes("просторно") ||
      text.includes("повече пространство") ||
      text.includes("свободно разположение") ||
      text.includes("open layout")
    ) {
      spacingMode = "open";

    } else if (
      text.includes("компактно") ||
      text.includes("по-компактно") ||
      text.includes("compact")
    ) {
      spacingMode = "compact";
    }

    // ДАНСИНГ
    
    let danceFloorPreference = "automatic";

    if (
      text.includes("голям дансинг") ||
      text.includes("голяма танцова зона") ||
      text.includes("large dance floor")
    ) {
      danceFloorPreference = "large";

    } else if (
      text.includes("малък дансинг") ||
      text.includes("малка танцова зона") ||
      text.includes("small dance floor")
    ) {
      danceFloorPreference = "small";
    }

    // ПОИСКАНИ ЕЛЕМЕНТИ
   
    return {
      style,
      guestCount,
      tableType,
      roundTableCount,
      rectTableCount,
      spacingMode,
      danceFloorPreference,

      includeAltar:
        !text.includes("без арка") &&
        (
          text.includes("арка") ||
          text.includes("altar")
        ),

      includeAisle:
        !text.includes("без пътека") &&
        (
          text.includes("пътека") ||
          text.includes("aisle")
        ),

      includeHeadTable:
        !text.includes("без президиум") &&
        !text.includes("без предизиум") &&
        (
          text.includes("президиум") ||
          text.includes("предизиум") ||
          text.includes("президиом") ||
          text.includes("маса за младоженците") ||
          text.includes("младоженска маса") ||
          text.includes("head table")
        ),

      includeDanceFloor:
        !text.includes("без дансинг") &&
        (
          text.includes("дансинг") ||
          text.includes("танцова зона") ||
          text.includes("dance floor")
        ),

      includePhotoZone:
        !text.includes("без фотозона") &&
        (
          text.includes("фотозона") ||
          text.includes("фото зона") ||
          text.includes("photo zone")
        ),

      includeCakeZone:
        !text.includes("без зона за торта") &&
        (
          text.includes("зона за торта") ||
          text.includes("тортена зона") ||
          text.includes("cake zone")
        ),

      includeDJBooth:
        !text.includes("без dj") &&
        !text.includes("без диджей") &&
        (
          text.includes("dj") ||
          text.includes("диджей")
        ),

      includeBarZone:
        !text.includes("без бар") &&
        (
          text.includes("бар зона") ||
          text.includes("бар") ||
          text.includes("bar zone")
        )
    };
  }

  // LAYOUT ENGINE

  function getSizeTier(guestCount) {
    if (guestCount <= 80) return "small";
    if (guestCount <= 130) return "medium";
    if (guestCount <= 180) return "large";

    return "extraLarge";
  }

  function getTableScale(sizeTier, tableType, spacingMode) {
    const scales = {
      small: {
        roundTable: 0.78,
        rectTable: 0.78
      },

      medium: {
        roundTable: 0.72,
        rectTable: 0.70
      },

      large: {
        roundTable: 0.68,
        rectTable: 0.66
      },

      extraLarge: {
        roundTable: 0.60,
        rectTable: 0.58
      }
    };

    let scale = scales[sizeTier][tableType];

    if (spacingMode === "open") {
      scale *= 0.94;
    }

    if (spacingMode === "compact") {
      scale *= 1.02;
    }

    return Math.max(
      0.56,
      Math.min(0.82, scale)
    );
  }

  function getDanceFloorConfig(requirements, sizeTier) {
    const presets = {
      small: {
        width: 190,
        height: 125,
        y: 700
      },

      medium: {
        width: 245,
        height: 165,
        y: 705
      },

      large: {
        width: 295,
        height: 200,
        y: 710
      },

      extraLarge: {
        width: 320,
        height: 215,
        y: 710
      }
    };

    const danceFloor = {
      ...presets[sizeTier]
    };

    if (requirements.style === "Luxury") {
      danceFloor.width *= 1.06;
      danceFloor.height *= 1.06;
    }

    if (requirements.style === "Boho") {
      danceFloor.width *= 1.04;
      danceFloor.height *= 1.04;
    }

    if (requirements.danceFloorPreference === "large") {
      danceFloor.width *= 1.12;
      danceFloor.height *= 1.12;

    } else if (
      requirements.danceFloorPreference === "small"
    ) {
      danceFloor.width *= 0.86;
      danceFloor.height *= 0.86;
    }

    return {
      x: STAGE_WIDTH / 2,
      y: danceFloor.y,
      width: Math.round(danceFloor.width),
      height: Math.round(danceFloor.height)
    };
  }

  function calculateGrid(
    count,
    zone,
    elementWidth,
    elementHeight,
    preferredColumns
  ) {
    if (count <= 0) return [];

    const slots = [];

    const zoneWidth =
      zone.right - zone.left;

    const zoneHeight =
      zone.bottom - zone.top;

    // Максимум две колони във всяка страна.
    const columns =
      Math.min(2, count);

    const rows =
      Math.ceil(count / columns);

    const horizontalPadding = Math.max(
      elementWidth / 2 + 10,
      45
    );

    const verticalPadding = Math.max(
      elementHeight / 2 + 10,
      45
    );

    const usableWidth = Math.max(
      0,
      zoneWidth - horizontalPadding * 2
    );

    const usableHeight = Math.max(
      0,
      zoneHeight - verticalPadding * 2
    );

    const gapX =
      columns === 1
        ? 0
        : usableWidth / (columns - 1);

    const gapY =
      rows === 1
        ? 0
        : usableHeight / (rows - 1);

    for (let row = 0; row < rows; row++) {
      for (
        let column = 0;
        column < columns;
        column++
      ) {
        if (slots.length >= count) {
          break;
        }

        const x =
          columns === 1
            ? zone.left + zoneWidth / 2
            : zone.left +
              horizontalPadding +
              column * gapX;

        const y =
          rows === 1
            ? zone.top + zoneHeight / 2
            : zone.top +
              verticalPadding +
              row * gapY;

        slots.push({
          x: Math.round(x),
          y: Math.round(y),
          rotation: 0
        });
      }
    }

    return slots;
  }

  // COLLISION / OVERLAP PROTECTION

  function getLayoutElementSize(type, scale = 1) {
    const sizes = {
      roundTable: {
        width: 190,
        height: 190
      },

      rectTable: {
        width: 255,
        height: 185
      },

      altar: {
        width: 230,
        height: 150
      },

      headTable: {
        width: 300,
        height: 130
      },

      aisle: {
        width: 150,
        height: 330
      },

      danceFloor: {
        width: 300,
        height: 210
      },

      photoZone: {
        width: 230,
        height: 210
      },

      cakeZone: {
        width: 190,
        height: 210
      },

      djBooth: {
        width: 280,
        height: 190
      },

      barZone: {
        width: 260,
        height: 200
      }
    };

    const size =
      sizes[type] || {
        width: 180,
        height: 140
      };

    return {
      width: size.width * scale,
      height: size.height * scale
    };
  }

  function getLayoutRect(element) {
    const scale =
      Number(element.scale) || 1;

    let size =
      getLayoutElementSize(
        element.type,
        scale
      );

    if (
      element.type === "danceFloor" &&
      element.width &&
      element.height
    ) {
      size = {
        width:
          Number(element.width) * scale,

        height:
          Number(element.height) * scale
      };
    }

    return {
      left:
        element.x - size.width / 2,

      right:
        element.x + size.width / 2,

      top:
        element.y - size.height / 2,

      bottom:
        element.y + size.height / 2
    };
  }

  function doLayoutElementsOverlap(
    first,
    second,
    padding = 20
  ) {
    const a =
      getLayoutRect(first);

    const b =
      getLayoutRect(second);

    return !(
      a.right + padding < b.left ||
      a.left - padding > b.right ||
      a.bottom + padding < b.top ||
      a.top - padding > b.bottom
    );
  }

  function hasLayoutCollision(
    candidate,
    elements
  ) {
    return elements.some(
      existing =>
        doLayoutElementsOverlap(
          candidate,
          existing,
          18
        )
    );
  }

  function findSafeLayoutPosition(
    element,
    existingElements
  ) {
    if (
      !hasLayoutCollision(
        element,
        existingElements
      )
    ) {
      return element;
    }

    const originalX =
      element.x;

    const originalY =
      element.y;

    const stepX = 80;
    const stepY = 70;

    const maxRadius = 6;

    for (
      let radius = 1;
      radius <= maxRadius;
      radius++
    ) {
      for (
        let dx = -radius;
        dx <= radius;
        dx++
      ) {
        for (
          let dy = -radius;
          dy <= radius;
          dy++
        ) {
          if (
            Math.abs(dx) !== radius &&
            Math.abs(dy) !== radius
          ) {
            continue;
          }

          const candidate = {
            ...element,

            x:
              originalX +
              dx * stepX,

            y:
              originalY +
              dy * stepY
          };

          const rect =
            getLayoutRect(candidate);

          if (
            rect.left < 270 ||
            rect.right >
              STAGE_WIDTH - 270 ||
            rect.top < 170 ||
            rect.bottom >
              STAGE_HEIGHT - 140
          ) {
            continue;
          }

          if (
            !hasLayoutCollision(
              candidate,
              existingElements
            )
          ) {
            return candidate;
          }
        }
      }
    }

    for (
      let y = 220;
      y <= STAGE_HEIGHT - 120;
      y += 70
    ) {
      for (
        let x = 320;
        x <= STAGE_WIDTH - 320;
        x += 80
      ) {
        const candidate = {
          ...element,
          x,
          y
        };

        const rect =
          getLayoutRect(candidate);

        if (
          rect.left < 270 ||
          rect.right >
            STAGE_WIDTH - 270 ||
          rect.top < 170 ||
          rect.bottom >
            STAGE_HEIGHT - 80
        ) {
          continue;
        }

        if (
          !hasLayoutCollision(
            candidate,
            existingElements
          )
        ) {
          return candidate;
        }
      }
    }

    console.warn(
      "Не е намерена свободна позиция за:",
      element.type
    );

    return element;
  }

  // LAYOUT CONFIG
  
  function calculateLayoutConfig(requirements) {
    const guestCount = Math.max(
      10,
      Number(requirements.guestCount) || 100
    );

    const tableType =
      requirements.tableType || "roundTable";

    const explicitRoundTables = Math.max(
      0,
      Number(requirements.roundTableCount) || 0
    );

    const explicitRectTables = Math.max(
      0,
      Number(requirements.rectTableCount) || 0
    );

    const hasExplicitTableCounts =
      explicitRoundTables > 0 ||
      explicitRectTables > 0;

    let requestedRoundTables = 0;
    let requestedRectTables = 0;

    if (hasExplicitTableCounts) {
      requestedRoundTables =
        explicitRoundTables;

      requestedRectTables =
        explicitRectTables;

    } else if (
      tableType === "rectTable"
    ) {
      requestedRectTables = Math.ceil(
        guestCount /
        TABLE_GEOMETRY.rectTable.seats
      );

    } else if (
      tableType === "mixed"
    ) {
      const approximateTables =
        Math.ceil(guestCount / 9);

      requestedRoundTables =
        Math.ceil(
          approximateTables / 2
        );

      requestedRectTables =
        approximateTables -
        requestedRoundTables;

    } else {
      requestedRoundTables = Math.ceil(
        guestCount /
        TABLE_GEOMETRY.roundTable.seats
      );
    }

    const requestedTableCount =
      requestedRoundTables +
      requestedRectTables;

    const sizeTier =
      getSizeTier(guestCount);

    // Единен размер Manual + AI.
    const tableScale =
      ELEMENT_SCALE;

    const danceFloor =
      getDanceFloorConfig(
        requirements,
        sizeTier
      );

    const maximumRenderableTables =
      tableType === "roundTable"
        ? 24
        : 20;

    const renderedTableCount =
      Math.min(
        requestedTableCount,
        maximumRenderableTables
      );

    const leftCount =
      Math.ceil(
        renderedTableCount / 2
      );

    const rightCount =
      renderedTableCount -
      leftCount;

    const tableWidth = Math.round(
      Math.max(
        TABLE_GEOMETRY.roundTable.baseWidth,
        TABLE_GEOMETRY.rectTable.baseWidth
      ) * tableScale
    );

    const tableHeight = Math.round(
      Math.max(
        TABLE_GEOMETRY.roundTable.baseHeight,
        TABLE_GEOMETRY.rectTable.baseHeight
      ) * tableScale
    );

    const sideMargin =
      sizeTier === "small"
        ? 280
        : 270;

    const centerClearance = 190;

    const leftZone = {
      left: sideMargin,
      right:
        STAGE_WIDTH / 2 -
        centerClearance,
      top: 280,
      bottom: 1000
    };

    const rightZone = {
      left:
        STAGE_WIDTH / 2 +
        centerClearance,
      right:
        STAGE_WIDTH -
        sideMargin,
      top: 280,
      bottom: 1000
    };

    const preferredColumns = 2;

    const leftSlots =
      calculateGrid(
        leftCount,
        leftZone,
        tableWidth,
        tableHeight,
        preferredColumns
      );

    const rightSlots =
      calculateGrid(
        rightCount,
        rightZone,
        tableWidth,
        tableHeight,
        preferredColumns
      );

    const warnings = [];

    if (
      requestedTableCount >
      maximumRenderableTables
    ) {
      warnings.push(
        `Необходимите маси са ${requestedTableCount}, но оптималният капацитет на тази зала е ${maximumRenderableTables} маси.`
      );
    }

    if (
      leftSlots.length < leftCount ||
      rightSlots.length < rightCount
    ) {
      warnings.push(
        "Не всички маси могат да бъдат разположени при безопасните минимални отстояния."
      );
    }

    if (guestCount > 200) {
      warnings.push(
        "За този брой гости се препоръчва по-голяма физическа зала."
      );
    }

    return {
      hall: {
        name:
          `${requirements.style} Wedding Hall`,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT
      },

      style:
        requirements.style,

      sizeTier,

      spacingMode:
        requirements.spacingMode,

      capacity: {
        guestCount,
        tableType,
        requestedRoundTables,
        requestedRectTables,
        requestedTableCount,

        renderedTableCount:
          leftSlots.length +
          rightSlots.length,

        estimatedCapacity:
          requestedRoundTables * 8 +
          requestedRectTables * 10
      },

      ceremony: {
        altar: {
          x: STAGE_WIDTH / 2,
          y: 150
        },

        headTable: {
          x: STAGE_WIDTH / 2,
          y: 320
        },

        aisle: {
          x: STAGE_WIDTH / 2,
          y: 500
        }
      },

      danceFloor,

      sideZones: {
        photoZone: {
          x: 180,
          y: 250
        },

        cakeZone: {
          x: 180,
          y: 610
        },

        barZone: {
          x: 1520,
          y: 250
        },

        djBooth: {
          x: 1520,
          y: 610
        }
      },

      tables: {
        scale: tableScale,
        leftSlots,
        rightSlots
      },

      warnings
    };
  }

  // CREATE LAYOUT
  
  function createLayoutFromRequirements(requirements) {
    const config =
      calculateLayoutConfig(requirements);

    const elements = [];

    let id = 1;

    const addIfIncluded = (
      included,
      type,
      position,
      extra = {}
    ) => {
      if (!included) {
        return;
      }

      let newElement = {
        id: id++,
        type,
        x: position.x,
        y: position.y,
        rotation: 0,
        scale: ELEMENT_SCALE,
        ...extra
      };

      newElement =
        findSafeLayoutPosition(
          newElement,
          elements
        );

      elements.push(
        newElement
      );
    };

    // Арката и президиумът са фиксирана
    // церемониална композиция.

    if (requirements.includeAltar) {
      elements.push({
        id: id++,
        type: "altar",
        x: config.ceremony.altar.x,
        y: config.ceremony.altar.y,
        rotation: 0,
        scale: ELEMENT_SCALE
      });
    }

    if (
      requirements.includeHeadTable
    ) {
      elements.push({
        id: id++,
        type: "headTable",
        x:
          config.ceremony.headTable.x,
        y:
          config.ceremony.headTable.y,
        rotation: 0,
        scale: ELEMENT_SCALE
      });
    }

    addIfIncluded(
      requirements.includeAisle,
      "aisle",
      config.ceremony.aisle
    );

    addIfIncluded(
      requirements.includeDanceFloor,
      "danceFloor",
      config.danceFloor,
      {
        width:
          DANCE_FLOOR_SIZE.width,
        height:
          DANCE_FLOOR_SIZE.height,
        scale:
          ELEMENT_SCALE
      }
    );

    addIfIncluded(
      requirements.includePhotoZone,
      "photoZone",
      config.sideZones.photoZone
    );

    addIfIncluded(
      requirements.includeCakeZone,
      "cakeZone",
      config.sideZones.cakeZone
    );

    addIfIncluded(
      requirements.includeBarZone,
      "barZone",
      config.sideZones.barZone
    );

    addIfIncluded(
      requirements.includeDJBooth,
      "djBooth",
      config.sideZones.djBooth
    );

    const tableSlots = [];

    const maximumSideLength = Math.max(
      config.tables.leftSlots.length,
      config.tables.rightSlots.length
    );

    for (
      let index = 0;
      index < maximumSideLength;
      index++
    ) {
      if (
        config.tables.leftSlots[index]
      ) {
        tableSlots.push(
          config.tables.leftSlots[index]
        );
      }

      if (
        config.tables.rightSlots[index]
      ) {
        tableSlots.push(
          config.tables.rightSlots[index]
        );
      }
    }

    let remainingRoundTables =
      config.capacity.requestedRoundTables;

    let remainingRectTables =
      config.capacity.requestedRectTables;

    tableSlots.forEach(
      (slot, index) => {
        let currentTableType;

        if (
          config.capacity.tableType ===
          "mixed"
        ) {
          if (
            remainingRoundTables > 0 &&
            remainingRectTables > 0
          ) {
            currentTableType =
              index % 2 === 0
                ? "roundTable"
                : "rectTable";

            if (
              currentTableType ===
                "roundTable" &&
              remainingRoundTables <= 0
            ) {
              currentTableType =
                "rectTable";
            }

            if (
              currentTableType ===
                "rectTable" &&
              remainingRectTables <= 0
            ) {
              currentTableType =
                "roundTable";
            }

          } else if (
            remainingRoundTables > 0
          ) {
            currentTableType =
              "roundTable";

          } else {
            currentTableType =
              "rectTable";
          }

        } else if (
          config.capacity.tableType ===
          "rectTable"
        ) {
          currentTableType =
            "rectTable";

        } else {
          currentTableType =
            "roundTable";
        }

        if (
          currentTableType ===
          "roundTable"
        ) {
          remainingRoundTables--;
        }

        if (
          currentTableType ===
          "rectTable"
        ) {
          remainingRectTables--;
        }

        const seats =
          currentTableType ===
          "rectTable"
            ? 10
            : 8;

        let tableElement = {
          id: id++,
          type: currentTableType,
          tableNumber: index + 1,
          x: slot.x,
          y: slot.y,

          rotation:
            currentTableType ===
            "rectTable"
              ? 0
              : slot.rotation,

          seats,

          scale:
            ELEMENT_SCALE
        };

        tableElement =
          findSafeLayoutPosition(
            tableElement,
            elements
          );

        elements.push(
          tableElement
        );
      }
    );

    return {
      hall:
        config.hall,

      layoutInfo: {
        style:
          config.style,

        guestCount:
          config.capacity.guestCount,

        tableType:
          config.capacity.tableType,

        sizeTier:
          config.sizeTier,

        spacingMode:
          config.spacingMode,

        generatedBy:
          "AI Assisted Layout Engine",

        version:
          "2.2"
      },

      statistics: {
        requestedGuests:
          config.capacity.guestCount,

        requestedTables:
          config.capacity.requestedTableCount,

        renderedTables:
          tableSlots.length,

        roundTables:
          Math.min(
            config.capacity.requestedRoundTables,
            tableSlots.length
          ),

        rectTables:
          Math.min(
            config.capacity.requestedRectTables,

            Math.max(
              0,
              tableSlots.length -
              config.capacity.requestedRoundTables
            )
          ),

        totalSeats:
          (
            Math.min(
              config.capacity.requestedRoundTables,
              tableSlots.length
            ) * 8
          ) +
          (
            Math.min(
              config.capacity.requestedRectTables,

              Math.max(
                0,
                tableSlots.length -
                config.capacity.requestedRoundTables
              )
            ) * 10
          )
      },

      warnings:
        config.warnings,

      elements
    };
  }

  function generateAutoLayoutFromDescription(description) {
    if (
      !description ||
      !description.trim()
    ) {
      alert(
        "Моля, опишете желаното разпределение на залата."
      );

      return null;
    }

    const requirements =
      extractLayoutRequirements(description);

    const layout =
      createLayoutFromRequirements(
        requirements
      );

    generateLayoutFromJSON(layout);

    return layout;
  }

  // INITIALIZATION AND PUBLIC API
 
  drawPlannerBackground();

  window.plannerStage = stage;
  window.plannerLayer = layer;

  window.plannerDrawVenueBackground =
    drawPlannerBackground;

  window.generateLayoutFromJSON =
    generateLayoutFromJSON;

  window.generateAutoLayoutFromDescription =
    generateAutoLayoutFromDescription;

  window.createLayoutFromRequirements =
    createLayoutFromRequirements;

  window.clearPlannerSelection = function (
    force = false
  ) {
    if (
      selectedElement &&
      !selectedElement.isDestroyed()
    ) {
      selectedElement.opacity(1);
    }

    if (force) {
      selectedElement = null;
    }

    layer.batchDraw();
  };

  // MANUAL CONTROLS

  const manualButtons = {
    addRoundTable: [
      "roundTable",
      180,
      180,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addRectTable: [
      "rectTable",
      260,
      220,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addAltar: [
      "altar",
      420,
      120,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addDanceFloor: [
      "danceFloor",
      520,
      360,
      0,
      DANCE_FLOOR_SIZE.width,
      DANCE_FLOOR_SIZE.height,
      ELEMENT_SCALE
    ],

    addAisle: [
      "aisle",
      760,
      260,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addHeadTable: [
      "headTable",
      560,
      120,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addPhotoZone: [
      "photoZone",
      900,
      140,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addCakeZone: [
      "cakeZone",
      980,
      340,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addDJBooth: [
      "djBooth",
      1180,
      180,
      0,
      180,
      110,
      ELEMENT_SCALE
    ],

    addBarZone: [
      "barZone",
      1350,
      360,
      0,
      180,
      110,
      ELEMENT_SCALE
    ]
  };

  Object.entries(manualButtons).forEach(
    ([buttonId, elementData]) => {
      document
        .getElementById(buttonId)
        ?.addEventListener(
          "click",
          function () {
            addPlannerElement(
              ...elementData
            );

            layer.draw();
          }
        );
    }
  );

  document
    .getElementById("clearPlanner")
    ?.addEventListener(
      "click",
      clearPlanner
    );

  // SAVE LAYOUT
  
  document
    .getElementById("saveLayout")
    ?.addEventListener(
      "click",
      async function () {
        const userId =
          localStorage.getItem(
            "wedding_user_id"
          );

        if (!userId) {
          alert(
            "Моля, влезте в профила си, за да запазите разпределението."
          );

          window.location.href =
            "login.html";

          return;
        }

        const layoutData =
          stage.toJSON();

        localStorage.setItem(
          "weddingLayout",
          layoutData
        );

        try {
          const response =
            await fetch(
              "../backend/php/save_latest_layout.php",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                  user_id: userId,
                  layout_json: layoutData
                })
              }
            );

          const data =
            await response.json();

          alert(
            data.message ||
            "Разпределението беше запазено успешно."
          );

        } catch (error) {
          console.error(error);

          alert(
            "Възникна проблем при запазване на разпределението."
          );
        }
      }
    );

  // LOAD LAYOUT
  
  document
    .getElementById("loadLayout")
    ?.addEventListener(
      "click",
      function () {
        const savedLayout =
          localStorage.getItem(
            "weddingLayout"
          );

        if (!savedLayout) {
          alert(
            "Няма запазено разпределение."
          );

          return;
        }

        try {
          const savedStageData =
            JSON.parse(savedLayout);

          const savedLayerData =
            savedStageData.children?.find(
              function (child) {
                return (
                  child.className ===
                  "Layer"
                );
              }
            );

          if (
            !savedLayerData ||
            !Array.isArray(
              savedLayerData.children
            )
          ) {
            alert(
              "Запазеното разпределение е невалидно."
            );

            return;
          }

          // Почистваме активния layer.
          layer.destroyChildren();

          // Зареждаме елементите директно
          // в активния planner layer.
          savedLayerData.children.forEach(
            function (childData) {
              const node =
                Konva.Node.create(
                  childData
                );

              if (
                node.getClassName() ===
                "Group"
              ) {
                applySelectable(node);
              }

              layer.add(node);
            }
          );

          selectedElement = null;

          layer.draw();

          // Статистика на реално
          // заредените елементи.
          const roundTables =
            stage.find(
              ".roundTable"
            ).length;

          const rectTables =
            stage.find(
              ".rectTable"
            ).length;

          const totalSeats =
            roundTables * 8 +
            rectTables * 10;

          const totalSeatsEl =
            document.getElementById(
              "summaryTotalSeats"
            );

          const roundTablesEl =
            document.getElementById(
              "summaryRoundTables"
            );

          const rectTablesEl =
            document.getElementById(
              "summaryRectTables"
            );

          const spaceStatusEl =
            document.getElementById(
              "summarySpaceStatus"
            );

          if (totalSeatsEl) {
            totalSeatsEl.textContent =
              `Общо места: ${totalSeats}`;
          }

          if (roundTablesEl) {
            roundTablesEl.textContent =
              `Кръгли маси: ${roundTables}`;
          }

          if (rectTablesEl) {
            rectTablesEl.textContent =
              `Правоъгълни маси: ${rectTables}`;
          }

          if (spaceStatusEl) {
            spaceStatusEl.textContent =
              "Свободно пространство: Добро";
          }

          console.log(
            "Заредени кръгли маси:",
            roundTables
          );

          console.log(
            "Заредени правоъгълни маси:",
            rectTables
          );

          console.log(
            "Общо места:",
            totalSeats
          );

          alert(
            "Разпределението беше заредено успешно."
          );

        } catch (error) {
          console.error(
            "Грешка при зареждане на разпределението:",
            error
          );

          alert(
            "Възникна проблем при зареждане на разпределението."
          );
        }
      }
    );
}