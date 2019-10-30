class ImageMagnifier {
    constructor(config) {
        this.imageReference = null;
        this.windowReference = null;
        this.targetReference = null;

        this.imageNaturalWidth = null;
        this.imageNaturalHeight = null;
        this.imageModifiedWidth = null;
        this.imageModifiedHeight = null;
        this.imageOffsetLeft = null;
        this.imageOffsetTop = null;
        this.imageType = null;
        this.imageAspectRatio = null;
        this.imageWidthCoefficient = null;
        this.imageHeightCoefficient = null;

        this.windowWidth = null;
        this.windowHeight = null;
        this.windowOffsetLeft = null;
        this.windowOffsetTop = null;
        this.windowEventHandler = null;

        this.targetWidth = null;
        this.targetHeight = null;

        this.configBuffer = config || {};
    }

    onInit = () => {
        this.imageReference = document.getElementById(this.configBuffer['imageId']);
        this.windowReference = document.getElementById(this.configBuffer['windowId']);
        this.targetReference = document.getElementById(this.configBuffer['targetId']);

        this.targetWidth = this.targetReference.offsetWidth;
        this.targetHeight = this.targetReference.offsetHeight;

        this.windowEventHandler = this.__mouseMoveEvent.bind(this);

        this.__styleReferences();
        this.__handleEvents();

        return this;
    };
    uploadImage = (source) => {
        this.imageReference.src = source;
        this.imageReference.onload = () => {
            this.__configImageOption();
            this.__configWindowOption();
            this.__configTargetOption();
        };
    };

    __handleEvents = () => {
        this.imageReference.onmouseenter = (event) => this.__mouseEnterEvent(event);
        this.imageReference.onmouseleave = (event) => this.__mouseLeaveEvent(event);
    };
    __styleReferences = () => {
        this.windowReference.style.boxSizing = 'border-box';
        this.windowReference.style.pointerEvents = 'none';
        this.targetReference.style.backgroundSize = 'auto';
        this.targetReference.style.backgroundRepeat = 'no-repeat';
        this.targetReference.style.backgroundPositionX = '0';
        this.targetReference.style.backgroundPositionY = '0';
    };
    __configImageOption = () => {
        this.imageNaturalWidth = this.imageReference.naturalWidth;
        this.imageNaturalHeight = this.imageReference.naturalHeight;
        this.imageModifiedWidth = this.imageReference.offsetWidth;
        this.imageModifiedHeight = this.imageReference.offsetHeight;
        this.imageOffsetLeft = this.imageReference.offsetLeft;
        this.imageOffsetTop = this.imageReference.offsetTop;
        this.imageAspectRatio = parseFloat((this.imageNaturalWidth / this.imageNaturalHeight).toFixed(2));
        this.imageWidthCoefficient = parseFloat((this.imageNaturalWidth / this.imageModifiedWidth).toFixed(2));
        this.imageHeightCoefficient = parseFloat((this.imageNaturalHeight / this.imageModifiedHeight).toFixed(2));

        if (this.imageAspectRatio > 1) {
            this.imageType = 'LANDSCAPE';
        } else if (this.imageAspectRatio < 1) {
            this.imageType = 'PORTRAIT';
        } else {
            this.imageType = 'SQUARE';
        }
    };
    __configWindowOption = () => {
        if (this.imageType === 'SQUARE') {
            this.windowReference.style.width = this.imageModifiedWidth + 'px';
            this.windowReference.style.height = this.imageModifiedHeight + 'px';
        } else if (this.imageType === 'LANDSCAPE') {
            this.windowReference.style.height = this.targetWidth / this.imageHeightCoefficient + 'px';
            this.windowReference.style.width = this.windowReference.offsetHeight + 'px';
        } else if (this.imageType === 'PORTRAIT') {
            this.windowReference.style.width = this.targetHeight / this.imageWidthCoefficient + 'px';
            this.windowReference.style.height = this.windowReference.offsetWidth + 'px';
        }

        this.windowWidth = this.windowReference.offsetWidth;
        this.windowHeight = this.windowReference.offsetHeight;
    };
    __configTargetOption = () => {
        this.targetReference.style.backgroundImage = `url(${this.imageReference.src})`;
    };
    __mouseEnterEvent = (event) => {
        this.imageReference.addEventListener('mousemove', this.windowEventHandler, true);
    };
    __mouseMoveEvent = (event) => {
        const x = event.layerX;
        const y = event.layerY;

        const leftSideLimit = (this.windowWidth / 2) + this.imageOffsetLeft;
        const rightSideLimit = this.imageModifiedWidth - (this.windowWidth / 2) + this.imageOffsetLeft;
        const upperSideLimit = (this.windowHeight / 2 ) + this.imageOffsetTop;
        const lowerSideLimit = this.imageModifiedHeight - (this.windowHeight / 2) + this.imageOffsetTop;

        if (x < leftSideLimit) {
            this.windowOffsetLeft = 0 + this.imageOffsetLeft;
        } else if (x >= leftSideLimit && x <= rightSideLimit) {
            this.windowOffsetLeft = x - this.windowWidth / 2;
        } else if (x > rightSideLimit) {
            this.windowOffsetLeft = this.imageModifiedWidth - this.windowWidth + this.imageOffsetLeft;
        }

        if (y < upperSideLimit) {
            this.windowOffsetTop = 0 + this.imageOffsetTop;
        } else if (y >= upperSideLimit && y <= lowerSideLimit) {
            this.windowOffsetTop = y - this.windowWidth / 2;
        } else if (y > lowerSideLimit) {
            this.windowOffsetTop = this.imageModifiedHeight - this.windowHeight + this.imageOffsetTop;
        }

        this.__windowReferenceTransform();
        this.__targetImageRender();
    };
    __mouseLeaveEvent = (event) => {
        this.imageReference.removeEventListener('mousemove', this.windowEventHandler, true);
    };
    __windowReferenceTransform = () => {
        this.windowReference.style.transform = `translateX(${this.windowOffsetLeft}px) translateY(${this.windowOffsetTop}px)`;
    };
    __targetImageRender = () => {
        this.targetReference.style.backgroundPositionX = -(this.windowOffsetLeft * this.imageWidthCoefficient) + this.imageOffsetLeft * this.imageWidthCoefficient + 'px';
        this.targetReference.style.backgroundPositionY = -(this.windowOffsetTop * this.imageHeightCoefficient) + this.imageOffsetTop * this.imageHeightCoefficient + 'px';
    };
}
