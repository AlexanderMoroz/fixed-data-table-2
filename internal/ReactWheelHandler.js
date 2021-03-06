/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is utility that handles onWheel events and calls provided wheel
 * callback with correct frame rate.
 *
 * @providesModule ReactWheelHandler
 * @typechecks
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emptyFunction = require('./emptyFunction');

var _emptyFunction2 = _interopRequireDefault(_emptyFunction);

var _normalizeWheel = require('./normalizeWheel');

var _normalizeWheel2 = _interopRequireDefault(_normalizeWheel);

var _requestAnimationFramePolyfill = require('./requestAnimationFramePolyfill');

var _requestAnimationFramePolyfill2 = _interopRequireDefault(_requestAnimationFramePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactWheelHandler = function () {
  /**
   * onWheel is the callback that will be called with right frame rate if
   * any wheel events happened
   * onWheel should is to be called with two arguments: deltaX and deltaY in
   * this order
   */
  function ReactWheelHandler(
  /*function*/onWheel,
  /*boolean|function*/handleScrollX,
  /*boolean|function*/handleScrollY,
  /*?boolean|?function*/stopPropagation) {
    _classCallCheck(this, ReactWheelHandler);

    this._animationFrameID = null;
    this._deltaX = 0;
    this._deltaY = 0;
    this._didWheel = this._didWheel.bind(this);
    this._rootRef = null;
    if (typeof handleScrollX !== 'function') {
      handleScrollX = handleScrollX ? _emptyFunction2.default.thatReturnsTrue : _emptyFunction2.default.thatReturnsFalse;
    }

    if (typeof handleScrollY !== 'function') {
      handleScrollY = handleScrollY ? _emptyFunction2.default.thatReturnsTrue : _emptyFunction2.default.thatReturnsFalse;
    }

    if (typeof stopPropagation !== 'function') {
      stopPropagation = stopPropagation ? _emptyFunction2.default.thatReturnsTrue : _emptyFunction2.default.thatReturnsFalse;
    }

    this._handleScrollX = handleScrollX;
    this._handleScrollY = handleScrollY;
    this._stopPropagation = stopPropagation;
    this._onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  _createClass(ReactWheelHandler, [{
    key: 'contains',
    value: function contains(target) {
      var parent = target;
      while (parent != document.body) {
        if (parent === this._rootRef) {
          return true;
        }
        parent = parent.parentNode;
      }
      return false;
    }
  }, {
    key: 'onWheel',
    value: function onWheel( /*object*/event) {
      var normalizedEvent = (0, _normalizeWheel2.default)(event);
      var deltaX = this._deltaX + normalizedEvent.pixelX;
      var deltaY = this._deltaY + normalizedEvent.pixelY;
      var handleScrollX = this._handleScrollX(deltaX, deltaY);
      var handleScrollY = this._handleScrollY(deltaY, deltaX);
      if (!handleScrollX && !handleScrollY) {
        return;
      }

      if (this._rootRef && !this.contains(event.target)) {
        return;
      }

      this._deltaX += handleScrollX ? normalizedEvent.pixelX : 0;
      this._deltaY += handleScrollY ? normalizedEvent.pixelY : 0;
      event.preventDefault();

      var changed;
      if (this._deltaX !== 0 || this._deltaY !== 0) {
        if (this._stopPropagation()) {
          event.stopPropagation();
        }
        changed = true;
      }

      if (changed === true && this._animationFrameID === null) {
        this._animationFrameID = (0, _requestAnimationFramePolyfill2.default)(this._didWheel);
      }
    }
  }, {
    key: 'setRoot',
    value: function setRoot(rootRef) {
      this._rootRef = rootRef;
    }
  }, {
    key: '_didWheel',
    value: function _didWheel() {
      this._animationFrameID = null;
      this._onWheelCallback(this._deltaX, this._deltaY);
      this._deltaX = 0;
      this._deltaY = 0;
    }
  }]);

  return ReactWheelHandler;
}();

module.exports = ReactWheelHandler;