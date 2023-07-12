/**
 * PhotoSwipe Dynamic Caption plugin v1.1.0
 * https://github.com/dimsemenov/photoswipe-dynamic-caption-plugin
 * 
 * By https://dimsemenov.com
 */

const defaultOptions = {
  captionContent: '.pswp-caption-content',
  type: 'auto',
  horizontalEdgeThreshold: 20,
  mobileCaptionOverlapRatio: 0.3,
  mobileLayoutBreakpoint: 600,
};

class PhotoSwipeDynamicCaption {
  constructor(lightbox, options) {
    this.options = {
      ...defaultOptions,
      ...options
    };

    this.lightbox = lightbox;

    this.lightbox.on('init', () => {
      this.initPlugin();
    });
  }

  initPlugin() {
    this.pswp = this.lightbox.pswp;
    this.isCaptionHidden = false;
    this.tempCaption = false;
    this.captionElement = false;

    this.pswp.on('uiRegister', () => {
      this.pswp.ui.registerElement({
        name: 'dynamic-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '',
        onInit: (el) => {
          this.captionElement = el;
          this.initCaption();
        }
      });
    });
  }

  initCaption() {
    const { pswp } = this;

    pswp.on('change', () => {
      this.updateCaptionHTML(); 
      this.updateCurrentCaptionPosition();

      // make sure caption is displayed after slides are switched
      this.showCaption();
    });

    pswp.on('calcSlideSize', (e) => this.onCalcSlideSize(e));

    // hide caption if mainscroll is shifted (dragging)
    pswp.on('moveMainScroll', () => {
      if (!this.useMobileLayout()) {
        if (this.pswp.mainScroll.isShifted()) {
          this.hideCaption();
        } else {
          this.showCaption();
        }
      }
    });

    // hide caption if zoomed
    pswp.on('zoomPanUpdate', () => {
      if (pswp.currSlide.currZoomLevel > pswp.currSlide.zoomLevels.initial) {
        this.hideCaption();
      } else {
        this.showCaption();
      }
    });

    pswp.on('beforeZoomTo', (e) => {
      const { currSlide } = pswp;

      if (currSlide.__dcAdjustedPanAreaSize) {
        if (e.destZoomLevel > currSlide.zoomLevels.initial) {
          currSlide.panAreaSize.x = currSlide.__dcOriginalPanAreaSize.x;
          currSlide.panAreaSize.y = currSlide.__dcOriginalPanAreaSize.y;
        } else {
          // Restore panAreaSize after we zoom back to initial position
          currSlide.panAreaSize.x = currSlide.__dcAdjustedPanAreaSize.x;
          currSlide.panAreaSize.y = currSlide.__dcAdjustedPanAreaSize.y;
        }
      }
    });
  }

  useMobileLayout() {
    const { mobileLayoutBreakpoint } = this.options;

    if (typeof mobileLayoutBreakpoint === 'function') {
      return mobileLayoutBreakpoint.call(this);
    } else if (typeof mobileLayoutBreakpoint === 'number') {
      if (window.innerWidth < mobileLayoutBreakpoint) {
        return true;
      }
    }
    
    return false;
  }

  hideCaption() {
    if (!this.isCaptionHidden) {
      this.isCaptionHidden = true;
      this.captionElement.classList.add('pswp__dynamic-caption--faded');

      // Disable caption visibility with the delay, so it's not interactable 
      if (this.captionFadeTimeout) {
        clearTimeout(this.captionFadeTimeout);
      }
      this.captionFadeTimeout = setTimeout(() => {
        this.captionElement.style.visibility = 'hidden';
        this.captionFadeTimeout = null;
      }, 400);
    }
  }

  showCaption() {
    if (this.isCaptionHidden) {
      this.isCaptionHidden = false;
      this.captionElement.style.visibility = 'visible';
      
      clearTimeout(this.captionFadeTimeout);
      this.captionFadeTimeout = setTimeout(() => {
        this.captionElement.classList.remove('pswp__dynamic-caption--faded');
        this.captionFadeTimeout = null;
      }, 50);
    }
  }

  setCaptionPosition(x, y) {
    const isOnHorizontalEdge = (x <= this.options.horizontalEdgeThreshold);
    this.captionElement.classList[
      isOnHorizontalEdge ? 'add' : 'remove'
    ]('pswp__dynamic-caption--on-hor-edge');

    this.captionElement.style.left = x + 'px';
    this.captionElement.style.top = y + 'px';
  }

  setCaptionWidth(captionEl, width) {
    if (!width) {
      captionEl.style.removeProperty('width');
    } else {
      captionEl.style.width = width + 'px';
    }
  }

  setCaptionType(captionEl, type) {
    const prevType = captionEl.dataset.pswpCaptionType;
    if (type !== prevType) {
      captionEl.classList.add('pswp__dynamic-caption--' + type);
      captionEl.classList.remove('pswp__dynamic-caption--' + prevType);
      captionEl.dataset.pswpCaptionType = type;
    }
  }

  updateCurrentCaptionPosition() {
    const slide = this.pswp.currSlide;

    if (!slide.dynamicCaptionType) {
      return;
    }

    if (slide.dynamicCaptionType === 'mobile') {
      this.setCaptionType(this.captionElement, slide.dynamicCaptionType);
      
      this.captionElement.style.removeProperty('left');
      this.captionElement.style.removeProperty('top');
      this.setCaptionWidth(this.captionElement, false);
      return;
    }

    const zoomLevel = slide.zoomLevels.initial;
    const imageWidth = Math.ceil(slide.width * zoomLevel);
    const imageHeight = Math.ceil(slide.height * zoomLevel);

    
    this.setCaptionType(this.captionElement, slide.dynamicCaptionType);
    if (slide.dynamicCaptionType === 'aside') {
      this.setCaptionPosition(
        this.pswp.currSlide.bounds.center.x + imageWidth,
        this.pswp.currSlide.bounds.center.y
      );
      this.setCaptionWidth(this.captionElement, false);
    } else if (slide.dynamicCaptionType === 'below') {
      this.setCaptionPosition(
        this.pswp.currSlide.bounds.center.x,
        this.pswp.currSlide.bounds.center.y + imageHeight
      );
      this.setCaptionWidth(this.captionElement, imageWidth);
    }
  }

  /**
   * Temporary caption is used to measure size for the current/next/previous captions,
   * (it has visibility:hidden)
   */
  createTemporaryCaption() {
    this.tempCaption = document.createElement('div');
    this.tempCaption.className = 'pswp__dynamic-caption pswp__dynamic-caption--temp';
    this.tempCaption.style.visibility = 'hidden';
    this.tempCaption.setAttribute('aria-hidden', 'true');
    // move caption element, so it's after BG,
    // so that other controls can freely overlap it
    this.pswp.bg.after(this.captionElement); 
    this.captionElement.after(this.tempCaption);
  }

  onCalcSlideSize(e) {
    const { slide } = e;

    const captionHTML = this.getCaptionHTML(e.slide);
    let useMobileVersion = false;
    let captionSize;

    if (!captionHTML) {
      slide.dynamicCaptionType = false;
      return;
    }

    this.storeOriginalPanAreaSize(slide);

    slide.bounds.update(slide.zoomLevels.initial);
    
    if (this.useMobileLayout()) {
      slide.dynamicCaptionType = 'mobile';
      useMobileVersion = true;
    } else {
      if (this.options.type === 'auto') {
        if (slide.bounds.center.x > slide.bounds.center.y) {
          slide.dynamicCaptionType = 'aside';
        } else {
          slide.dynamicCaptionType = 'below';
        }
      } else {
        slide.dynamicCaptionType = this.options.type;
      }
    } 

    const imageWidth = Math.ceil(slide.width * slide.zoomLevels.initial);
    const imageHeight = Math.ceil(slide.height * slide.zoomLevels.initial);

    if (!this.tempCaption) {
      this.createTemporaryCaption();
    }

    this.setCaptionType(this.tempCaption, slide.dynamicCaptionType);

    if (slide.dynamicCaptionType === 'aside') {
      this.tempCaption.innerHTML = this.getCaptionHTML(e.slide);
      this.setCaptionWidth(this.tempCaption, false);
      captionSize = this.measureCaptionSize(this.tempCaption, e.slide);
      const captionWidth = captionSize.x;      

      const horizontalEnding = imageWidth + slide.bounds.center.x;
      const horizontalLeftover = (slide.panAreaSize.x - horizontalEnding);

      if (horizontalLeftover <= captionWidth) {
        slide.panAreaSize.x -= captionWidth;
        this.recalculateZoomLevelAndBounds(slide);
      } else {
        // do nothing, caption will fit aside without any adjustments
      }
    } else if (slide.dynamicCaptionType === 'below' || useMobileVersion) {
      this.setCaptionWidth(
        this.tempCaption, 
        useMobileVersion ? this.pswp.viewportSize.x : imageWidth
      );
      this.tempCaption.innerHTML = this.getCaptionHTML(e.slide);
      captionSize = this.measureCaptionSize(this.tempCaption, e.slide);
      const captionHeight = captionSize.y;


      // vertical ending of the image
      const verticalEnding = imageHeight + slide.bounds.center.y;

      // height between bottom of the screen and ending of the image
      // (before any adjustments applied) 
      const verticalLeftover = slide.panAreaSize.y - verticalEnding;
      const initialPanAreaHeight = slide.panAreaSize.y;

      if (verticalLeftover <= captionHeight) {
        // lift up the image to give more space for caption
        slide.panAreaSize.y -= Math.min((captionHeight - verticalLeftover) * 2, captionHeight);

        // we reduce viewport size, thus we need to update zoom level and pan bounds
        this.recalculateZoomLevelAndBounds(slide);

        const maxPositionX = slide.panAreaSize.x * this.options.mobileCaptionOverlapRatio / 2;

        // Do not reduce viewport height if too few space available
        if (useMobileVersion 
            && slide.bounds.center.x > maxPositionX) {
          // Restore the default position
          slide.panAreaSize.y = initialPanAreaHeight;
          this.recalculateZoomLevelAndBounds(slide);
        }
      }

      
      
      // if (this.useMobileLayout && slide.bounds.center.x > 100) {
      //   // do nothing, caption will overlap the bottom part of the image
      // } else if (verticalLeftover <= captionHeight) {
        
      // } else {
      //   // do nothing, caption will fit below the image without any adjustments
      // }
    } else {
      // mobile
    }

    this.storeAdjustedPanAreaSize(slide);

    if (slide === this.pswp.currSlide) {
      this.updateCurrentCaptionPosition();
    }
  }

  measureCaptionSize(captionEl, slide) {
    const rect = captionEl.getBoundingClientRect();
    const event = this.pswp.dispatch('dynamicCaptionMeasureSize', {
      captionEl,
      slide,
      captionSize: {
        x: rect.width,
        y: rect.height
      }
    });
    return event.captionSize;
  }

  recalculateZoomLevelAndBounds(slide) {
    slide.zoomLevels.update(slide.width, slide.height, slide.panAreaSize);
    slide.bounds.update(slide.zoomLevels.initial);
  }

  storeAdjustedPanAreaSize(slide) {
    if (!slide.__dcAdjustedPanAreaSize) {
      slide.__dcAdjustedPanAreaSize = {};
    }
    slide.__dcAdjustedPanAreaSize.x = slide.panAreaSize.x;
    slide.__dcAdjustedPanAreaSize.y = slide.panAreaSize.y;
  }

  storeOriginalPanAreaSize(slide) {
    if (!slide.__dcOriginalPanAreaSize) {
      slide.__dcOriginalPanAreaSize = {};
    }
    slide.__dcOriginalPanAreaSize.x = slide.panAreaSize.x;
    slide.__dcOriginalPanAreaSize.y = slide.panAreaSize.y;
  }

  getCaptionHTML(slide) {
    if (typeof this.options.captionContent === 'function') {
      return this.options.captionContent.call(this, slide);
    }

    const currSlideElement = slide.data.element;
    let captionHTML = '';
    if (currSlideElement) {
      const hiddenCaption = currSlideElement.querySelector(this.options.captionContent);
      if (hiddenCaption) {
        // get caption from element with class pswp-caption-content
        captionHTML = hiddenCaption.innerHTML;
      } else {
        const img = currSlideElement.querySelector('img');
        if (img) {
          // get caption from alt attribute
          captionHTML = img.getAttribute('alt');
        }
      }
    }
    return captionHTML;
  }

  updateCaptionHTML() {
    const captionHTML = this.getCaptionHTML(pswp.currSlide);
    this.captionElement.style.visibility = captionHTML ? 'visible' :  'hidden';
    this.captionElement.innerHTML = captionHTML || '';
    this.pswp.dispatch('dynamicCaptionUpdateHTML', { 
      captionElement: this.captionElement
    });
  }
}

export default PhotoSwipeDynamicCaption;
