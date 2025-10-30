class StatusBar extends DrawableObject {

    x = 10;
    y = 0;
    width = 200;
    height = 60;
    statusbarType;
    percentage = 100;

    STATUSBAR_HEALTH = [
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    STATUSBAR_COIN = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',

    ];

    STATUSBAR_BOTTLE = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    STATUSBAR_ENDBOSS = [
        'img/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/img/7_statusbars/2_statusbar_endboss/green/green100.png',
    ]

    constructor(statusbarType) {
        super();
        this.statusbarType = statusbarType;
        this.loadImages(this.getStatusbarImage());
        this.setPositionByStatusbarType();
        this.setStatusbarHealthPercentage();
    }

    setStatusbarHealthPercentage() {
        if (this.statusbarType === 'health') {
            this.setPercentage(100);
        } else if (this.statusbarType === 'endboss') {
            this.setPercentage(100);
        } else {
            this.setPercentage(0);
        }
    }

    setPositionByStatusbarType() {
        if (this.statusbarType === 'health') {
            this.y = 0;
        } else if (this.statusbarType === 'coins') {
            this.y = 50;
        } else if (this.statusbarType === 'bottle') {
            this.y = 100;
        } else if (this.statusbarType === 'endboss') {
            this.y = 8;
            this.x = 500;
        }
    }

    getStatusbarImage() {
        if (this.statusbarType === 'health') {
            return this.STATUSBAR_HEALTH;
        } else if (this.statusbarType === 'coins') {
            return this.STATUSBAR_COIN;
        } else if (this.statusbarType === 'bottle') {
            return this.STATUSBAR_BOTTLE;
        } else if (this.statusbarType === 'endboss') {
            return this.STATUSBAR_ENDBOSS;
        }
    }

    setPercentage(percentage){
        this.percentage = percentage;
        const statusbarImage = this.getStatusbarImage();
        let path = statusbarImage[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
            if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        } 
    }
}