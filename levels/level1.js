/**
 * Holds the current level configuration.
 * @type {Level}
 */
let level1;

/**
 * Creates and initializes level 1.
 * Sets up enemies, clouds, background objects, bottles and coins.
 */
function setupLevel() {
  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new Endboss(),
    ],

    [
      new Cloud("img/img/5_background/layers/4_clouds/2.png", 200),
      new Cloud("img/img/5_background/layers/4_clouds/1.png", 900),
      new Cloud("img/img/5_background/layers/4_clouds/2.png", 1600),
      new Cloud("img/img/5_background/layers/4_clouds/1.png", 2300),
      new Cloud("img/img/5_background/layers/4_clouds/2.png", 3000),
    ],

    [
      new BackgroundObject("img/img/5_background/layers/air.png", -720),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/2.png", -720),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/2.png", -720),

      new BackgroundObject("img/img/5_background/layers/air.png", 0),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/img/5_background/layers/air.png", 720),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/2.png", 720),

      new BackgroundObject("img/img/5_background/layers/air.png", 1440),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/1.png", 1440),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/1.png", 1440),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/1.png", 1440),

      new BackgroundObject("img/img/5_background/layers/air.png", 2160),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/2.png", 2160),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/2.png", 2160),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/2.png", 2160),

      new BackgroundObject("img/img/5_background/layers/air.png", 2880),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/1.png", 2880),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/1.png", 2880),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/1.png", 2880),

      new BackgroundObject("img/img/5_background/layers/air.png", 3600),
      new BackgroundObject("img/img/5_background/layers/3_third_layer/2.png", 3600),
      new BackgroundObject("img/img/5_background/layers/2_second_layer/2.png", 3600),
      new BackgroundObject("img/img/5_background/layers/1_first_layer/2.png", 3600),
    ],

    [
      new CollectBottle("img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"),
      new CollectBottle("img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"),
      new CollectBottle("img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"),
      new CollectBottle("img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"),
      new CollectBottle("img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"),
      new CollectBottle("img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"),
    ],

    [
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
      new CollectCoins(),
    ]
  );
}
